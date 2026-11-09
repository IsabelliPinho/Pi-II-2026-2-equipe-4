package com.gabicake.api.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "configuracao_loja")
public class ConfiguracaoLojaEntity {

    @Id
    private Integer id = 1;

    @Column(name = "endereco_loja", nullable = false, length = 300)
    private String enderecoLoja;

    @Column(precision = 9, scale = 6)
    private BigDecimal latitude;

    @Column(precision = 9, scale = 6)
    private BigDecimal longitude;

    @Column(
        name = "raio_entrega_km",
        nullable = false,
        precision = 8,
        scale = 3
    )
    private BigDecimal raioEntregaKm;

    @Column(name = "antecedencia_minima_horas", nullable = false)
    private Integer antecedenciaMinimaHoras = 0;

    @Column(name = "url_planilha_financeira", length = 2048)
    private String urlPlanilhaFinanceira;

    public ConfiguracaoLojaEntity() {
    }

    public Integer getId() {
        return id;
    }

    public String getEnderecoLoja() {
        return enderecoLoja;
    }

    public void setEnderecoLoja(String enderecoLoja) {
        this.enderecoLoja = enderecoLoja;
    }

    public BigDecimal getLatitude() {
        return latitude;
    }

    public void setLatitude(BigDecimal latitude) {
        this.latitude = latitude;
    }

    public BigDecimal getLongitude() {
        return longitude;
    }

    public void setLongitude(BigDecimal longitude) {
        this.longitude = longitude;
    }

    public BigDecimal getRaioEntregaKm() {
        return raioEntregaKm;
    }

    public void setRaioEntregaKm(BigDecimal raioEntregaKm) {
        this.raioEntregaKm = raioEntregaKm;
    }

    public Integer getAntecedenciaMinimaHoras() {
        return antecedenciaMinimaHoras;
    }

    public void setAntecedenciaMinimaHoras(Integer antecedenciaMinimaHoras) {
        this.antecedenciaMinimaHoras = antecedenciaMinimaHoras;
    }

    public String getUrlPlanilhaFinanceira() {
        return urlPlanilhaFinanceira;
    }

    public void setUrlPlanilhaFinanceira(String urlPlanilhaFinanceira) {
        this.urlPlanilhaFinanceira = urlPlanilhaFinanceira;
    }
}