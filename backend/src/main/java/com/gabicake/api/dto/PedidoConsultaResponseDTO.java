package com.gabicake.api.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class PedidoConsultaResponseDTO {

    private Long id;
    private Long idCliente;
    private String nomeGerente;
    private LocalDate dataPedido;
    private LocalDateTime dataPrevista;
    private String statusPedido;
    private String formaEntrega;

    // Construtor vazio necessário para a instanciação via new + setters
    public PedidoConsultaResponseDTO() {
    }

    // Construtor com argumentos (caso utilize em outro lugar)
    public PedidoConsultaResponseDTO(Long id, Long idCliente, String nomeGerente, LocalDate dataPedido, 
                                     LocalDateTime dataPrevista, String statusPedido, String formaEntrega) {
        this.id = id;
        this.idCliente = idCliente;
        this.nomeGerente = nomeGerente;
        this.dataPedido = dataPedido;
        this.dataPrevista = dataPrevista;
        this.statusPedido = statusPedido;
        this.formaEntrega = formaEntrega;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(Long idCliente) {
        this.idCliente = idCliente;
    }

    public String getNomeGerente() {
        return nomeGerente;
    }

    public void setNomeGerente(String nomeGerente) {
        this.nomeGerente = nomeGerente;
    }

    public LocalDate getDataPedido() {
        return dataPedido;
    }

    public void setDataPedido(LocalDate dataPedido) {
        this.dataPedido = dataPedido;
    }

    public LocalDateTime getDataPrevista() {
        return dataPrevista;
    }

    public void setDataPrevista(LocalDateTime dataPrevista) {
        this.dataPrevista = dataPrevista;
    }

    public String getStatusPedido() {
        return statusPedido;
    }

    public void setStatusPedido(String statusPedido) {
        this.statusPedido = statusPedido;
    }

    public String getFormaEntrega() {
        return formaEntrega;
    }

    public void setFormaEntrega(String formaEntrega) {
        this.formaEntrega = formaEntrega;
    }
}