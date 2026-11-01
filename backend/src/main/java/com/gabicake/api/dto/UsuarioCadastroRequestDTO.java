package com.gabicake.api.dto;

// Corpo de POST /usuarios/cadastro. "perfil" é o nome do perfil (GERENTE ou FUNCIONARIO).
public record UsuarioCadastroRequestDTO(
    String nome,
    String login,
    String senha,
    String perfil
) {
    // O toString() padrão de um record imprimiria a senha; este esconde (vai para logs/depuração).
    @Override
    public String toString() {
        return "UsuarioCadastroRequestDTO[nome=" + nome + ", login=" + login + ", senha=***, perfil=" + perfil + "]";
    }
}