package com.gabicake.api.controller;

import com.gabicake.api.dto.LoginRequestDTO;
import com.gabicake.api.dto.LoginResponseDTO;
import com.gabicake.api.service.UsuarioService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UsuarioService service;

    public AuthController(UsuarioService service) {
        this.service = service;
    }

    // POST /auth/login
    // Credenciais erradas viram HTTP 401 pelo GlobalExceptionHandler (SecurityException).
    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody LoginRequestDTO dto) {
        return service.autenticar(dto);
    }
}