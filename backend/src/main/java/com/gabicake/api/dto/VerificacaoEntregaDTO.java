/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.gabicake.api.dto;

/**
 *
 * @author Sanara Carvalho
 */

public class VerificacaoEntregaDTO {
    private String cep;
    private String bairro;
    private String rua;
    private String numCasa;

    // Getters e Setters
    public String getCep() { return cep; }
    public void setCep(String cep) { this.cep = cep; }
    public String getBairro() { return bairro; }
    public void setBairro(String bairro) { this.bairro = bairro; }
    public String getRua() { return rua; }
    public void setRua(String rua) { this.rua = rua; }
    public String getNumCasa() { return numCasa; }
    public void setNumCasa(String numCasa) { this.numCasa = numCasa; }
}