package com.gabicake.api.controller;

import com.gabicake.api.dto.LoginRequestDTO;
import com.gabicake.api.dto.LoginResponseDTO;
import com.gabicake.api.service.SessaoService;
import com.gabicake.api.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UsuarioService service;
    private final SessaoService sessaoService;

    public AuthController(UsuarioService service, SessaoService sessaoService) {
        this.service = service;
        this.sessaoService = sessaoService;
    }

    // POST /auth/login -> { id, nome, login, perfis, perfil, token }
    // Credenciais erradas viram HTTP 401 pelo GlobalExceptionHandler (SecurityException).
    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody LoginRequestDTO dto) {
        return service.autenticar(dto);
    }

    // POST /auth/logout: revoga a sessão do token enviado
    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(@RequestHeader("Authorization") String authorization) {
        sessaoService.revogar(authorization.replaceFirst("(?i)^Bearer\\s+", "").trim());
    }
}
