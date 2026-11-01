package com.gabicake.api.dto;

import java.util.List;

// Resposta do cadastro. Não existe campo de senha nem de hash: eles nunca saem da API.
public record UsuarioResponseDTO(
    Long id,
    String nome,
    String login,
    List<String> perfis,
    boolean ativo
) {}