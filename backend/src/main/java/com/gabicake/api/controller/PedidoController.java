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
import com.gabicake.api.dto.VerificacaoEntregaDTO;
import com.gabicake.api.model.Pedido;
import com.gabicake.api.service.PedidoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController

public class PedidoController {

    private final PedidoService service;

    public PedidoController(PedidoService service) {
        this.service = service;
    }

    // GET /pedidos/consulta?status=PENDENTE
    @GetMapping("/pedidos/consulta")
    public List<PedidoConsultaResponseDTO> buscar(@RequestParam(required = false) String status) {
        return service.consultarPedidosResumidos(status);
    }

    // GET /pedidos/{id}
    @GetMapping("/pedidos/{id}")
    public Pedido buscarUm(@PathVariable Long id) {
        return service.buscarUm(id);
    }

    // POST /pedidos/cadastro
    @PostMapping("/pedidos/cadastro")
    @ResponseStatus(HttpStatus.CREATED)
    public Pedido registrar(@RequestBody Pedido pedido) {
        return service.registrar(pedido);
    }

    // PATCH /pedidos/{id}
    @PatchMapping("/pedidos/{id}")
    public PedidoAtualizacaoResponseDTO atualizar(@PathVariable Long id, @RequestBody Pedido alteracoes) {
        Pedido atualizado = service.atualizar(id, alteracoes);
        return new PedidoAtualizacaoResponseDTO(
                atualizado.getId(),
                atualizado.getStatusPedido(),
                atualizado.getAtualizadoEm()
        );
    }

    // GET /agenda
    @GetMapping("/agenda")  
    public ResponseEntity<Map<String, Object>> consultarAgenda(@RequestParam("data") String data) {
        Map<String, Object> agenda = service.consultarAgenda(data);
        return ResponseEntity.ok(agenda);
    }

    // GET /lembretes/pedidos/proximos
    @GetMapping("/lembretes/pedidos-proximos")
    public ResponseEntity<List<Map<String, Object>>> pedidosProximos(@RequestParam("dias") int dias) {
        List<Map<String, Object>> lembretes = service.listarPedidosProximos(dias);
        return ResponseEntity.ok(lembretes);
    }

    // POST /pedidos/verificar/entrega
    @PostMapping("/verificar/entrega")
    public ResponseEntity<Map<String, Object>> verificarEntrega(@RequestBody VerificacaoEntregaDTO endereco) {
        Map<String, Object> resultado = service.verificarRaioEntrega(endereco);
        return ResponseEntity.ok(resultado);
    }
}