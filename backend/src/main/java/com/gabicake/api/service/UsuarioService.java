package com.gabicake.api.service;

import com.gabicake.api.dto.LoginRequestDTO;
import com.gabicake.api.dto.LoginResponseDTO;
import com.gabicake.api.dto.UsuarioCadastroRequestDTO;
import com.gabicake.api.dto.UsuarioResponseDTO;
import com.gabicake.api.entity.PerfilEntity;
import com.gabicake.api.entity.UsuarioEntity;
import com.gabicake.api.exception.ApiException;
import com.gabicake.api.repository.PerfilRepository;
import com.gabicake.api.repository.UsuarioRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

/**
 * Criação de usuários e login, sempre com a senha protegida por hash BCrypt.
 * Regras de ouro deste serviço:
 *  - a senha pura só existe em memória, durante a chamada: nunca é gravada, devolvida nem logada;
 *  - o que vai para o banco é sempre o resultado de passwordEncoder.encode(...);
 *  - o login compara com passwordEncoder.matches(...), nunca com igualdade de texto.
 */
@Service
public class UsuarioService {

    // Mesma regra de ck_usuario_login (migration 04).
    private static final Pattern LOGIN = Pattern.compile("^[a-z0-9._-]{3,60}$");

    private static final int SENHA_TAMANHO_MINIMO = 8;
    // O BCrypt só considera os primeiros 72 bytes da senha; mais que isso seria ignorado em silêncio.
    private static final int SENHA_BYTES_MAXIMO = 72;

    // Mensagem do RF012: igual para "login não existe", "senha errada" e "usuário inativo",
    // para não revelar a quem tenta entrar quais logins existem.
    static final String DADOS_DE_ACESSO_INVALIDOS = "Dados de acesso inválidos.";

    private final UsuarioRepository usuarioRepository;
    private final PerfilRepository perfilRepository;
    private final PasswordEncoder passwordEncoder;

    // Hash de uma senha qualquer, usado quando o login informado não existe: assim o servidor faz
    // a mesma conta cara do BCrypt e o tempo de resposta não denuncia se o login existe.
    private final String hashFicticio;

    public UsuarioService(UsuarioRepository usuarioRepository,
                          PerfilRepository perfilRepository,
                          PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.perfilRepository = perfilRepository;
        this.passwordEncoder = passwordEncoder;
        this.hashFicticio = passwordEncoder.encode("senha-ficticia-que-ninguem-usa");
    }

    // POST /usuarios/cadastro
    @Transactional
    public UsuarioResponseDTO cadastrar(UsuarioCadastroRequestDTO dto) {
        if (dto == null) {
            throw ApiException.validacao("Os dados do usuário são obrigatórios.");
        }

        String nome = exigirTexto(dto.nome(), "nome", 120);
        String login = normalizarLogin(dto.login());
        validarSenha(dto.senha());
        String nomePerfil = exigirTexto(dto.perfil(), "perfil", 30).toUpperCase();

        PerfilEntity perfil = perfilRepository.findByNome(nomePerfil)
                .orElseThrow(() -> ApiException.validacao("Perfil inválido: " + nomePerfil + "."));

        if (usuarioRepository.existsByLogin(login)) {
            throw ApiException.conflito("Já existe um usuário com este login.");
        }

        UsuarioEntity usuario = new UsuarioEntity();
        usuario.setNome(nome);
        usuario.setLogin(login);
        usuario.setSenhaHash(passwordEncoder.encode(dto.senha())); // <- única forma de a senha chegar ao banco
        usuario.getPerfis().add(perfil);

        UsuarioEntity salvo;
        try {
            salvo = usuarioRepository.save(usuario);
        } catch (DataIntegrityViolationException e) {
            // Duas requisições com o mesmo login ao mesmo tempo: a segunda cai aqui.
            throw ApiException.conflito("Já existe um usuário com este login.");
        }

        return new UsuarioResponseDTO(salvo.getId().longValue(), salvo.getNome(), salvo.getLogin(),
                nomesDosPerfis(salvo), salvo.isAtivo());
    }

    // POST /auth/login
    @Transactional
    public LoginResponseDTO autenticar(LoginRequestDTO dto) {
        if (dto == null || dto.login() == null || dto.login().isBlank()
                || dto.senha() == null || dto.senha().isEmpty()) {
            throw ApiException.validacao("Informe o usuário e a senha.");
        }

        // Uma senha maior que 72 bytes nunca foi aceita no cadastro, então não pode estar correta.
        if (dto.senha().getBytes(StandardCharsets.UTF_8).length > SENHA_BYTES_MAXIMO) {
            throw new SecurityException(DADOS_DE_ACESSO_INVALIDOS);
        }

        Optional<UsuarioEntity> encontrado = usuarioRepository.findByLogin(dto.login().trim().toLowerCase());

        // Sempre faz UMA comparação de BCrypt, exista o usuário ou não.
        String hash = encontrado.map(UsuarioEntity::getSenhaHash).orElse(hashFicticio);
        boolean senhaConfere = passwordEncoder.matches(dto.senha(), hash);

        if (encontrado.isEmpty() || !senhaConfere || !encontrado.get().isAtivo()) {
            throw new SecurityException(DADOS_DE_ACESSO_INVALIDOS);
        }

        UsuarioEntity usuario = encontrado.get();

        // Se o custo configurado aumentou desde que este hash foi criado, aproveita que a senha
        // acabou de ser digitada e regrava o hash com o custo atual.
        if (passwordEncoder.upgradeEncoding(usuario.getSenhaHash())) {
            usuario.setSenhaHash(passwordEncoder.encode(dto.senha()));
            usuarioRepository.save(usuario);
        }

        return new LoginResponseDTO(usuario.getId().longValue(), usuario.getNome(), usuario.getLogin(),
                nomesDosPerfis(usuario));
    }

    private List<String> nomesDosPerfis(UsuarioEntity usuario) {
        return usuario.getPerfis().stream().map(PerfilEntity::getNome).sorted().toList();
    }

    private String normalizarLogin(String login) {
        String normalizado = login == null ? "" : login.trim().toLowerCase();
        if (!LOGIN.matcher(normalizado).matches()) {
            throw ApiException.validacao(
                    "Login inválido. Use de 3 a 60 caracteres: letras, números, ponto, hífen ou sublinhado.");
        }
        return normalizado;
    }

    // Não faz trim: espaços no começo/fim podem ser parte da senha escolhida.
    private void validarSenha(String senha) {
        if (senha == null || senha.length() < SENHA_TAMANHO_MINIMO) {
            throw ApiException.validacao("A senha deve ter pelo menos " + SENHA_TAMANHO_MINIMO + " caracteres.");
        }
        if (senha.getBytes(StandardCharsets.UTF_8).length > SENHA_BYTES_MAXIMO) {
            throw ApiException.validacao("A senha deve ter no máximo " + SENHA_BYTES_MAXIMO + " bytes (cerca de "
                    + SENHA_BYTES_MAXIMO + " caracteres sem acento).");
        }
    }

    private String exigirTexto(String valor, String campo, int tamanhoMaximo) {
        if (valor == null || valor.isBlank()) {
            throw ApiException.validacao("O campo " + campo + " é obrigatório.");
        }
        String texto = valor.trim();
        if (texto.length() > tamanhoMaximo) {
            throw ApiException.validacao("O campo " + campo + " deve ter no máximo " + tamanhoMaximo + " caracteres.");
        }
        return texto;
    }
}