
package com.gabicake.api.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "cliente")
public class ClienteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 120)
    private String nome;

    @Column(nullable = false, length = 20)
    private String telefone;

    @Column(nullable = false, length = 120)
    private String rua;

    @Column(name = "num_casa", nullable = false, length = 10)
    private String numCasa;

    @Column(nullable = false, length = 80)
    private String bairro;

    @Column(nullable = false, length = 9)
    private String cep;

    public ClienteEntity() {
    }

    public Integer getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getRua() {
        return rua;
    }

    public void setRua(String rua) {
        this.rua = rua;
    }

    public String getNumCasa() {
        return numCasa;
    }

    public void setNumCasa(String numCasa) {
        this.numCasa = numCasa;
    }

    public String getBairro() {
        return bairro;
    }

    public void setBairro(String bairro) {
        this.bairro = bairro;
    }

    public String getCep() {
        return cep;
    }

    public void setCep(String cep) {
        this.cep = cep;
    }
}
