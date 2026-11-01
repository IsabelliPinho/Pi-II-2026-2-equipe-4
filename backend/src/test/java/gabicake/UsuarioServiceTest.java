package gabicake;

import java.lang.reflect.Field;
import java.lang.reflect.Proxy;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.gabicake.api.dto.LoginRequestDTO;
import com.gabicake.api.dto.LoginResponseDTO;
import com.gabicake.api.dto.UsuarioCadastroRequestDTO;
import com.gabicake.api.dto.UsuarioResponseDTO;
import com.gabicake.api.entity.PerfilEntity;
import com.gabicake.api.entity.UsuarioEntity;
import com.gabicake.api.exception.ApiException;
import com.gabicake.api.repository.PerfilRepository;
import com.gabicake.api.repository.UsuarioRepository;
import com.gabicake.api.service.UsuarioService;

/**
 * Testa o serviço de usuários SEM banco e SEM subir o Spring: os repositórios são falsos,
 * em memória. Foco: a senha nunca é gravada em texto puro, e o login confere pelo hash.
 * Rodar: mvn test
 */
class UsuarioServiceTest {

    // Formato de um hash BCrypt (o mesmo que o banco exige em ck_usuario_senha_hash).
    private static final String FORMATO_BCRYPT = "^\\$2[aby]\\$\\d{2}\\$[./A-Za-z0-9]{53}$";

    // Hash gerado pelo PostgreSQL (pgcrypto), como o do 02-seed.sql: crypt('Senha@123', gen_salt('bf', 10))
    private static final String HASH_GERADO_PELO_POSTGRES = "$2a$10$8qCKy6OgZyFtylNBpbezyeoYlKXKfdEf3YZMQmATeeOz6x/r9c2ae";

    private static final String SENHA = "MinhaSenha#2026";

    // Custo 4 (o mínimo do BCrypt) só para os testes ficarem rápidos. Em produção o padrão é 10.
    private final PasswordEncoder encoder = new BCryptPasswordEncoder(4);
    private final Map<String, UsuarioEntity> banco = new HashMap<>();
    private final AtomicInteger proximoId = new AtomicInteger(1);
    private final UsuarioService service =
            new UsuarioService(usuarioRepositoryFalso(), perfilRepositoryFalso(), encoder);

    // ---------------------------------------------------------------- criação

    @Test
    void cadastroGravaHashBCryptENuncaASenhaPura() {
        service.cadastrar(cadastro("maria.souza", SENHA, "FUNCIONARIO"));

        String guardado = banco.get("maria.souza").getSenhaHash();
        assertNotEquals(SENHA, guardado);
        assertFalse(guardado.contains("MinhaSenha"));
        assertTrue(guardado.matches(FORMATO_BCRYPT));
        assertTrue(encoder.matches(SENHA, guardado));
    }

    @Test
    void mesmaSenhaGeraHashesDiferentes() {
        service.cadastrar(cadastro("maria.souza", SENHA, "FUNCIONARIO"));
        service.cadastrar(cadastro("joao.lima", SENHA, "FUNCIONARIO"));

        assertNotEquals(banco.get("maria.souza").getSenhaHash(), banco.get("joao.lima").getSenhaHash());
    }

    @Test
    void respostaEDepuracaoNaoExpoemSenhaNemHash() {
        UsuarioCadastroRequestDTO pedido = cadastro("maria.souza", SENHA, "GERENTE");
        UsuarioResponseDTO resposta = service.cadastrar(pedido);

        String hash = banco.get("maria.souza").getSenhaHash();
        assertFalse(resposta.toString().contains(hash));
        assertFalse(pedido.toString().contains(SENHA));
        assertFalse(new LoginRequestDTO("maria.souza", SENHA).toString().contains(SENHA));
        for (var campo : UsuarioResponseDTO.class.getRecordComponents()) {
            assertFalse(campo.getName().toLowerCase().contains("senha"));
            assertFalse(campo.getName().toLowerCase().contains("hash"));
        }
    }

    @Test
    void cadastroNormalizaOLogin() {
        UsuarioResponseDTO resposta = service.cadastrar(cadastro("  Maria.Souza ", SENHA, "funcionario"));

        assertEquals("maria.souza", resposta.login());
        assertTrue(banco.containsKey("maria.souza"));
        assertEquals("FUNCIONARIO", resposta.perfis().get(0));
    }

    @Test
    void cadastroRejeitaSenhaCurtaOuLongaDemais() {
        ApiException curta = assertThrows(ApiException.class,
                () -> service.cadastrar(cadastro("maria.souza", "1234567", "GERENTE")));
        assertEquals(HttpStatus.BAD_REQUEST, curta.getStatus());

        String longa = "a".repeat(73);
        ApiException longaDemais = assertThrows(ApiException.class,
                () -> service.cadastrar(cadastro("maria.souza", longa, "GERENTE")));
        assertEquals(HttpStatus.BAD_REQUEST, longaDemais.getStatus());

        assertTrue(banco.isEmpty());
    }

    @Test
    void cadastroRejeitaLoginInvalidoPerfilInexistenteEDuplicado() {
        assertEquals(HttpStatus.BAD_REQUEST, assertThrows(ApiException.class,
                () -> service.cadastrar(cadastro("ab", SENHA, "GERENTE"))).getStatus());
        assertEquals(HttpStatus.BAD_REQUEST, assertThrows(ApiException.class,
                () -> service.cadastrar(cadastro("com espaco", SENHA, "GERENTE"))).getStatus());
        assertEquals(HttpStatus.BAD_REQUEST, assertThrows(ApiException.class,
                () -> service.cadastrar(cadastro("maria.souza", SENHA, "CHEFE"))).getStatus());
        assertTrue(banco.isEmpty());

        service.cadastrar(cadastro("maria.souza", SENHA, "GERENTE"));
        ApiException duplicado = assertThrows(ApiException.class,
                () -> service.cadastrar(cadastro("MARIA.SOUZA", SENHA, "GERENTE")));
        assertEquals(HttpStatus.CONFLICT, duplicado.getStatus());
    }

    // ------------------------------------------------------------------ login

    @Test
    void loginComSenhaCorretaFunciona() {
        service.cadastrar(cadastro("maria.souza", SENHA, "GERENTE"));

        LoginResponseDTO resposta = service.autenticar(new LoginRequestDTO("Maria.Souza", SENHA));

        assertEquals("maria.souza", resposta.login());
        assertEquals("GERENTE", resposta.perfis().get(0));
    }

    @Test
    void senhaErradaELoginInexistenteDaoExatamenteAMesmaMensagem() {
        service.cadastrar(cadastro("maria.souza", SENHA, "GERENTE"));

        SecurityException senhaErrada = assertThrows(SecurityException.class,
                () -> service.autenticar(new LoginRequestDTO("maria.souza", "outra-senha-qualquer")));
        SecurityException loginInexistente = assertThrows(SecurityException.class,
                () -> service.autenticar(new LoginRequestDTO("ninguem", SENHA)));

        assertEquals("Dados de acesso inválidos.", senhaErrada.getMessage());
        assertEquals(senhaErrada.getMessage(), loginInexistente.getMessage());
    }

    @Test
    void usuarioInativoNaoEntreMesmoComSenhaCorreta() {
        service.cadastrar(cadastro("maria.souza", SENHA, "GERENTE"));
        banco.get("maria.souza").setAtivo(false);

        SecurityException erro = assertThrows(SecurityException.class,
                () -> service.autenticar(new LoginRequestDTO("maria.souza", SENHA)));
        assertEquals("Dados de acesso inválidos.", erro.getMessage());
    }

    @Test
    void loginAceitaHashGeradoPeloPostgresComoNoSeed() {
        banco.put("gabriela.almeida", usuarioComHash("gabriela.almeida", HASH_GERADO_PELO_POSTGRES));

        LoginResponseDTO resposta = service.autenticar(new LoginRequestDTO("gabriela.almeida", "Senha@123"));
        assertEquals("gabriela.almeida", resposta.login());

        assertThrows(SecurityException.class,
                () -> service.autenticar(new LoginRequestDTO("gabriela.almeida", "senha@123")));
    }

    @Test
    void textoPuroGravadoPorEnganoNaoViraSenhaValida() {
        banco.put("fulano", usuarioComHash("fulano", "Senha@123"));

        assertThrows(SecurityException.class,
                () -> service.autenticar(new LoginRequestDTO("fulano", "Senha@123")));
    }

    @Test
    void loginAtualizaOHashQuandoOCustoConfiguradoAumenta() {
        // Usuário antigo, com hash de custo 4; o serviço agora trabalha com custo 6.
        String hashAntigo = new BCryptPasswordEncoder(4).encode(SENHA);
        banco.put("maria.souza", usuarioComHash("maria.souza", hashAntigo));
        UsuarioService servicoMaisForte = new UsuarioService(usuarioRepositoryFalso(), perfilRepositoryFalso(),
                new BCryptPasswordEncoder(6));

        servicoMaisForte.autenticar(new LoginRequestDTO("maria.souza", SENHA));

        String hashNovo = banco.get("maria.souza").getSenhaHash();
        assertNotEquals(hashAntigo, hashNovo);
        assertTrue(hashNovo.startsWith("$2a$06$"));
        assertTrue(new BCryptPasswordEncoder(6).matches(SENHA, hashNovo));
    }

    @Test
    void loginRecusaCamposVaziosESenhaGigante() {
        assertEquals(HttpStatus.BAD_REQUEST, assertThrows(ApiException.class,
                () -> service.autenticar(new LoginRequestDTO("", SENHA))).getStatus());
        assertEquals(HttpStatus.BAD_REQUEST, assertThrows(ApiException.class,
                () -> service.autenticar(new LoginRequestDTO("maria.souza", ""))).getStatus());
        assertThrows(SecurityException.class,
                () -> service.autenticar(new LoginRequestDTO("maria.souza", "a".repeat(100))));
    }

    // ---------------------------------------------------------------- apoio

    private UsuarioCadastroRequestDTO cadastro(String login, String senha, String perfil) {
        return new UsuarioCadastroRequestDTO("Pessoa de Teste", login, senha, perfil);
    }

    // Usuário "que já estava no banco" (com id), com o hash que a gente quiser.
    private UsuarioEntity usuarioComHash(String login, String hash) {
        UsuarioEntity u = new UsuarioEntity();
        try {
            Field id = UsuarioEntity.class.getDeclaredField("id");
            id.setAccessible(true);
            id.set(u, proximoId.getAndIncrement());
        } catch (ReflectiveOperationException e) {
            throw new IllegalStateException(e);
        }
        u.setLogin(login);
        u.setNome("Pessoa de Teste");
        u.setSenhaHash(hash);
        u.getPerfis().add(perfil("GERENTE"));
        return u;
    }

    private PerfilEntity perfil(String nome) {
        try {
            PerfilEntity p = new PerfilEntity();
            Field f = PerfilEntity.class.getDeclaredField("nome");
            f.setAccessible(true);
            f.set(p, nome);
            return p;
        } catch (ReflectiveOperationException e) {
            throw new IllegalStateException(e);
        }
    }

    // Repositórios falsos: respondem só ao que o serviço usa e guardam tudo no mapa "banco".
    private UsuarioRepository usuarioRepositoryFalso() {
        return (UsuarioRepository) Proxy.newProxyInstance(getClass().getClassLoader(),
                new Class<?>[]{UsuarioRepository.class}, (proxy, metodo, args) -> {
                    switch (metodo.getName()) {
                        case "findByLogin":
                            return Optional.ofNullable(banco.get((String) args[0]));
                        case "existsByLogin":
                            return banco.containsKey((String) args[0]);
                        case "save":
                            UsuarioEntity u = (UsuarioEntity) args[0];
                            if (u.getId() == null) {
                                Field id = UsuarioEntity.class.getDeclaredField("id");
                                id.setAccessible(true);
                                id.set(u, proximoId.getAndIncrement());
                            }
                            banco.put(u.getLogin(), u);
                            return u;
                        default:
                            throw new UnsupportedOperationException(metodo.getName());
                    }
                });
    }

    private PerfilRepository perfilRepositoryFalso() {
        return (PerfilRepository) Proxy.newProxyInstance(getClass().getClassLoader(),
                new Class<?>[]{PerfilRepository.class}, (proxy, metodo, args) -> {
                    if (metodo.getName().equals("findByNome")) {
                        String nome = (String) args[0];
                        boolean existe = nome.equals("GERENTE") || nome.equals("FUNCIONARIO");
                        return existe ? Optional.of(perfil(nome)) : Optional.empty();
                    }
                    throw new UnsupportedOperationException(metodo.getName());
                });
    }
}