package com.gabicake.api.dto;

// Corpo de POST /auth/login.
public record LoginRequestDTO(
    String login,
    String senha
) {
    @Override
    public String toString() {
        return "LoginRequestDTO[login=" + login + ", senha=***]";
    }
}