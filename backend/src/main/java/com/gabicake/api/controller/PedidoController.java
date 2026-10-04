/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.gabicake.api.controller;

/**
 *
 * @author Sanara Carvalho
 */

import com.gabicake.api.dto.PedidoAtualizacaoResponseDTO;
import com.gabicake.api.dto.PedidoConsultaResponseDTO;
import com.gabicake.api.model.Pedido;
import com.gabicake.api.service.PedidoService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    private final PedidoService service;

    public PedidoController(PedidoService service) {
        this.service = service;
    }

    // GET /pedidos/consulta?status=PENDENTE
    @GetMapping("/consulta")
    public List<PedidoConsultaResponseDTO> buscar(@RequestParam(required = false) String status) {
        return service.consultarPedidosResumidos(status);
    }

    // GET /pedidos/{id}
    @GetMapping("/{id}")
    public Pedido buscarUm(@PathVariable Long id) {
        return service.buscarUm(id);
    }

    // POST /pedidos/cadastro
    @PostMapping("/cadastro")
    @ResponseStatus(HttpStatus.CREATED)
    public Pedido registrar(@RequestBody Pedido pedido) {
        return service.registrar(pedido);
    }

    // PATCH /pedidos/{id}
    @PatchMapping("/{id}")
    public PedidoAtualizacaoResponseDTO atualizar(@PathVariable Long id, @RequestBody Pedido alteracoes) {
        Pedido atualizado = service.atualizar(id, alteracoes);
        return new PedidoAtualizacaoResponseDTO(
                atualizado.getId(),
                atualizado.getStatusPedido(),
                atualizado.getAtualizadoEm()
        );
    }
}