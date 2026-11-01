package com.gabicake.api.dto;

import java.util.List;

// Resposta do login. Ainda sem token/sessão: isso vem na tarefa de controle de sessão (RF012).
public record LoginResponseDTO(
    Long id,
    String nome,
    String login,
    List<String> perfis
) {}