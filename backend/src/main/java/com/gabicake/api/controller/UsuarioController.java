package com.gabicake.api.controller;

import com.gabicake.api.dto.UsuarioCadastroRequestDTO;
import com.gabicake.api.dto.UsuarioResponseDTO;
import com.gabicake.api.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    // POST /usuarios/cadastro
    // ATENÇÃO: enquanto a tarefa de autorização (Matriz de Autorização) não existir, esta rota
    // está aberta para qualquer um. Antes de publicar o sistema, ela precisa ser restrita à gerente.
    @PostMapping("/cadastro")
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioResponseDTO cadastrar(@RequestBody UsuarioCadastroRequestDTO dto) {
        return service.cadastrar(dto);
    }
}