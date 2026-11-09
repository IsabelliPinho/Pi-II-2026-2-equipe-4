package com.gabicake.api.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "sessao")
public class SessaoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private UsuarioEntity usuario;

    @Column(name = "token_hash", nullable = false, unique = true, length = 64)
    private String tokenHash;

    @Column(name = "criada_em", nullable = false, updatable = false)
    private LocalDateTime criadaEm;

    @Column(name = "ultimo_acesso_em", nullable = false)
    private LocalDateTime ultimoAcessoEm;

    @Column(name = "expira_em", nullable = false)
    private LocalDateTime expiraEm;

    @Column(name = "revogada_em")
    private LocalDateTime revogadaEm;

    public SessaoEntity() {
    }

    public Integer getId() {
        return id;
    }

    public UsuarioEntity getUsuario() {
        return usuario;
    }

    public void setUsuario(UsuarioEntity usuario) {
        this.usuario = usuario;
    }

    public String getTokenHash() {
        return tokenHash;
    }

    public void setTokenHash(String tokenHash) {
        this.tokenHash = tokenHash;
    }

    public LocalDateTime getCriadaEm() {
        return criadaEm;
    }

    public void setCriadaEm(LocalDateTime criadaEm) {
        this.criadaEm = criadaEm;
    }

    public LocalDateTime getUltimoAcessoEm() {
        return ultimoAcessoEm;
    }

    public void setUltimoAcessoEm(LocalDateTime ultimoAcessoEm) {
        this.ultimoAcessoEm = ultimoAcessoEm;
    }

    public LocalDateTime getExpiraEm() {
        return expiraEm;
    }

    public void setExpiraEm(LocalDateTime expiraEm) {
        this.expiraEm = expiraEm;
    }

    public LocalDateTime getRevogadaEm() {
        return revogadaEm;
    }

    public void setRevogadaEm(LocalDateTime revogadaEm) {
        this.revogadaEm = revogadaEm;
    }

    @PrePersist
    void inicializar() {
        if (criadaEm == null) {
            criadaEm = LocalDateTime.now();
        }

        if (ultimoAcessoEm == null) {
            ultimoAcessoEm = criadaEm;
        }
    }
}