/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.gabicake.api.dto;

/**
 *
 * @author Sanara Carvalho
 */

import java.time.LocalDateTime;

public class PedidoAtualizacaoResponseDTO {

    private Long id;
    private String statusPedido;
    private LocalDateTime atualizadoEm;

    public PedidoAtualizacaoResponseDTO() {
    }

    public PedidoAtualizacaoResponseDTO(Long id, String statusPedido, LocalDateTime atualizadoEm) {
        this.id = id;
        this.statusPedido = statusPedido;
        this.atualizadoEm = atualizadoEm;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStatusPedido() {
        return statusPedido;
    }

    public void setStatusPedido(String statusPedido) {
        this.statusPedido = statusPedido;
    }

    public LocalDateTime getAtualizadoEm() {
        return atualizadoEm;
    }

    public void setAtualizadoEm(LocalDateTime atualizadoEm) {
        this.atualizadoEm = atualizadoEm;
    }
}