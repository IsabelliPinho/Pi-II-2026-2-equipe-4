/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.gabicake.api.model;

/**
 *
 * @author Sanara Carvalho
 */

import java.math.BigDecimal;

public class ItemPedido {

    private Long idProduto;
    private Integer quantidade;
    private String tipoMassa;
    private String tema;
    private BigDecimal peso;
    private String tipoRecheio;

    public Long getIdProduto() {
        return idProduto;
    }

    public void setIdProduto(Long idProduto) {
        this.idProduto = idProduto;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public String getTipoMassa() {
        return tipoMassa;
    }

    public void setTipoMassa(String tipoMassa) {
        this.tipoMassa = tipoMassa;
    }

    public String getTema() {
        return tema;
    }

    public void setTema(String tema) {
        this.tema = tema;
    }

    public BigDecimal getPeso() {
        return peso;
    }

    public void setPeso(BigDecimal peso) {
        this.peso = peso;
    }

    public String getTipoRecheio() {
        return tipoRecheio;
    }

    public void setTipoRecheio(String tipoRecheio) {
        this.tipoRecheio = tipoRecheio;
    }
}
