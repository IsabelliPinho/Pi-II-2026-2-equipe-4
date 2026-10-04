
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.gabicake.api.controller;

/**
 *
 * @author Sanara Carvalho
 */

import com.gabicake.api.dto.ClienteBuscaResponseDTO;
import com.gabicake.api.model.Cliente; // Necessário para o método cadastrar
import com.gabicake.api.service.ClienteService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    private final ClienteService service;

    public ClienteController(ClienteService service) {
        this.service = service;
    }

    // GET /clientes/busca?busca=maria
    @GetMapping("/busca")
    public List<ClienteBuscaResponseDTO> buscar(@RequestParam(required = false) String busca) {
        return service.buscar(busca);
    }

    // POST /clientes/cadastro
    @PostMapping("/cadastro")
    @ResponseStatus(HttpStatus.CREATED)
    public Cliente cadastrar(@RequestBody Cliente cliente) {
        return service.cadastrar(cliente);
    }
}