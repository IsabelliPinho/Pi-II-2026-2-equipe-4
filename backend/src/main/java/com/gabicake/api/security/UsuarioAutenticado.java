package com.gabicake.api.security;

import java.util.Set;

/** Quem está fazendo a requisição, já resolvido a partir do token. */
public record UsuarioAutenticado(Integer id, String login, String nome, Set<String> perfis) {

    public boolean temPerfil(String perfil) {
        return perfis.contains(perfil);
    }

    public boolean ehGerente() {
        return perfis.contains(Perfis.GERENTE);
    }
}
