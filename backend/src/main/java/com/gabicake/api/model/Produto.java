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

// Essa classe representa UM produto, exatamente como a tabela "produto" do
// banco: id (gerado automaticamente), nome (obrigatório) e preco
// (obrigatório, não pode ser negativo).
public class Produto {

    private Long id;
    private String nome;
    private BigDecimal preco;

    public Produto() {
    }

    public Produto(Long id, String nome, BigDecimal preco) {
        this.id = id;
        this.nome = nome;
        this.preco = preco;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public BigDecimal getPreco() {
        return preco;
    }

    public void setPreco(BigDecimal preco) {
        this.preco = preco;
    }
}
