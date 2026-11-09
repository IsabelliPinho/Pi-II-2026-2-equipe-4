package com.gabicake.api.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gabicake.api.entity.PerfilEntity;
import com.gabicake.api.entity.SessaoEntity;
import com.gabicake.api.entity.UsuarioEntity;
import com.gabicake.api.repository.SessaoRepository;
import com.gabicake.api.security.UsuarioAutenticado;

/**
 * Sessões (RF012): o token opaco vai para o cliente; no banco fica só o SHA-256 dele.
 * Vale 8 h no total e expira após 30 min sem uso.
 */
@Service
public class SessaoService {

    static final long DURACAO_HORAS = 8;
    static final long INATIVIDADE_MINUTOS = 30;

    private final SessaoRepository repository;
    private final SecureRandom random = new SecureRandom();

    public SessaoService(SessaoRepository repository) {
        this.repository = repository;
    }

    /** Cria a sessão e devolve o token em texto (única vez em que ele existe fora do cliente). */
    @Transactional
    public String criar(UsuarioEntity usuario) {
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

        LocalDateTime agora = LocalDateTime.now();
        SessaoEntity sessao = new SessaoEntity();
        sessao.setUsuario(usuario);
        sessao.setTokenHash(hash(token));
        sessao.setCriadaEm(agora);
        sessao.setUltimoAcessoEm(agora);
        sessao.setExpiraEm(agora.plusHours(DURACAO_HORAS));
        repository.save(sessao);
        return token;
    }

    /** Valida o token, renova o último acesso e devolve quem é o usuário. */
    @Transactional
    public Optional<UsuarioAutenticado> validar(String token) {
        if (token == null || token.isBlank()) {
            return Optional.empty();
        }
        LocalDateTime agora = LocalDateTime.now();
        return repository.buscarValida(hash(token), agora, agora.minusMinutes(INATIVIDADE_MINUTOS))
                .map(s -> {
                    s.setUltimoAcessoEm(agora);
                    UsuarioEntity u = s.getUsuario();
                    return new UsuarioAutenticado(u.getId(), u.getLogin(), u.getNome(),
                            u.getPerfis().stream().map(PerfilEntity::getNome).collect(Collectors.toSet()));
                });
    }

    @Transactional
    public void revogar(String token) {
        if (token == null || token.isBlank()) {
            return;
        }
        repository.findByTokenHash(hash(token))
                .filter(s -> s.getRevogadaEm() == null)
                .ifPresent(s -> s.setRevogadaEm(LocalDateTime.now()));
    }

    static String hash(String token) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(md.digest(token.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}
