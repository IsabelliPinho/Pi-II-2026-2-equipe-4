package com.gabicake.api.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "pedido")
public class PedidoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private ClienteEntity cliente;

    @Column(name = "nome_gerente", length = 120)
    private String nomeGerente;

    @Column(name = "gerente_id")
    private Integer gerenteId;

    @Column(name = "data_entrega")
    private LocalDate dataEntrega;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal desconto = BigDecimal.ZERO;

    @Column(name = "data_pedido", nullable = false)
    private LocalDate dataPedido;

    @Column(name = "data_prevista", nullable = false)
    private LocalDateTime dataPrevista;

    @Column(name = "status_pedido", length = 20, nullable = false)
    private String statusPedido = "PENDENTE";

    @Column(name = "forma_entrega", length = 10, nullable = false)
    private String formaEntrega;

    @Column(name = "entrega_bairro", length = 80)
    private String entregaBairro;

    @Column(name = "entrega_rua", length = 120)
    private String entregaRua;

    @Column(name = "entrega_num_casa", length = 10)
    private String entregaNumCasa;

    @Column(name = "entrega_cep", length = 9)
    private String entregaCep;

    @OneToMany(
        mappedBy = "pedido",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<ItemPedidoEntity> itens = new ArrayList<>();

    @Column(name = "atualizado_em", nullable = false)
    private LocalDateTime atualizadoEm;

    public PedidoEntity() {
    }

    public Integer getId() {
        return id;
    }

    public ClienteEntity getCliente() {
        return cliente;
    }

    public void setCliente(ClienteEntity cliente) {
        this.cliente = cliente;
    }

    public String getNomeGerente() {
        return nomeGerente;
    }

    public void setNomeGerente(String nomeGerente) {
        this.nomeGerente = nomeGerente;
    }

    public Integer getGerenteId() {
        return gerenteId;
    }

    public void setGerenteId(Integer gerenteId) {
        this.gerenteId = gerenteId;
    }

    public LocalDate getDataEntrega() {
        return dataEntrega;
    }

    public void setDataEntrega(LocalDate dataEntrega) {
        this.dataEntrega = dataEntrega;
    }

    public BigDecimal getDesconto() {
        return desconto;
    }

    public void setDesconto(BigDecimal desconto) {
        this.desconto = desconto;
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

    public List<ItemPedidoEntity> getItens() {
        return itens;
    }

    public void setItens(List<ItemPedidoEntity> itens) {
        List<ItemPedidoEntity> copia =
                itens == null ? List.of() : new ArrayList<>(itens);

        this.itens.clear();

        for (ItemPedidoEntity item : copia) {
            item.setPedido(this);
            this.itens.add(item);
        }
    }

    public LocalDateTime getAtualizadoEm() {
        return atualizadoEm;
    }

    public void setAtualizadoEm(LocalDateTime atualizadoEm) {
        this.atualizadoEm = atualizadoEm;
    }

    @PrePersist
    void antesDeInserir() {
        if (dataPedido == null) {
            dataPedido = LocalDate.now();
        }

        antesDeSalvar();
    }

    @PreUpdate
    void antesDeSalvar() {
        atualizadoEm = LocalDateTime.now();

        if ("ATENDIDO".equals(statusPedido) || "ENTREGUE".equals(statusPedido)) {
            if (dataEntrega == null) {
                dataEntrega = LocalDate.now();
            }
        } else {
            dataEntrega = null;
        }
    }
}