package com.gabicake.api.dto;

import java.util.List;

/** Resposta do login: o front usa token, perfil e nome. */
public record LoginResponseDTO(Long id, String nome, String login, List<String> perfis,
                               String perfil, String token) {
}
