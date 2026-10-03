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

public record PedidoConsultaResponseDTO(
    Long id,
    String nomeCliente,
    LocalDateTime dataPrevista,
    String formaEntrega,
    String statusPedido
) {}
