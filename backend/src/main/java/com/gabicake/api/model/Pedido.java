/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.gabicake.api.model;

/**
 *
 * @author Sanara Carvalho
 */

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

// 1.Modificando a ordem igual ao exigido no contrato 

@JsonPropertyOrder({
    "id",
    "idCliente",
    "nomeGerente",
    "dataPedido",
    "dataPrevista",
    "statusPedido",
    "formaEntrega",
    "entregaBairro",
    "entregaRua",
    "entregaNumCasa",
    "entregaCep",
    "itens"
})
// 2. Esconde os campos de endereço se forem null (ex: quando formaEntrega é "RETIRADA")

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Pedido {

    private Long id;
    private Long idCliente;
    private String nomeGerente;
    private LocalDate dataPedido;
    private LocalDateTime dataPrevista;
    private String statusPedido;
    private String formaEntrega;
    private String entregaBairro;
    private String entregaRua;
    private String entregaNumCasa;
    private String entregaCep;
    private List<ItemPedido> itens;
    private LocalDateTime atualizadoEm;

    public Pedido() {
    }

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

    public String getEntregaBairro() {
        return entregaBairro;
    }

    public void setEntregaBairro(String entregaBairro) {
        this.entregaBairro = entregaBairro;
    }

    public String getEntregaRua() {
        return entregaRua;
    }

    public void setEntregaRua(String entregaRua) {
        this.entregaRua = entregaRua;
    }

    public String getEntregaNumCasa() {
        return entregaNumCasa;
    }

    public void setEntregaNumCasa(String entregaNumCasa) {
        this.entregaNumCasa = entregaNumCasa;
    }

    public String getEntregaCep() {
        return entregaCep;
    }

    public void setEntregaCep(String entregaCep) {
        this.entregaCep = entregaCep;
    }

    public List<ItemPedido> getItens() {
        return itens;
    }

    public void setItens(List<ItemPedido> itens) {
        this.itens = itens;
    }

    public LocalDateTime getAtualizadoEm() {
        return atualizadoEm;
    }

    public void setAtualizadoEm(LocalDateTime atualizadoEm) {
        this.atualizadoEm = atualizadoEm;
    }
}
