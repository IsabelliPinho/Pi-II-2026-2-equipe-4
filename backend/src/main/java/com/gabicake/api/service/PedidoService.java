/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.gabicake.api.service;

/**
 *
 * @author Sanara Carvalho
 */

import com.gabicake.api.dto.PedidoConsultaResponseDTO;
import com.gabicake.api.exception.ApiException;
import com.gabicake.api.model.ItemPedido;
import com.gabicake.api.model.Pedido;
import com.gabicake.api.store.PedidoMockStore;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
public class PedidoService {

    private static final Set<String> STATUS_VALIDOS = Set.of("PENDENTE", "ATENDIDO", "CANCELADO");

    private final PedidoMockStore store;

    public PedidoService(PedidoMockStore store) {
        this.store = store;
    }

    public List<PedidoConsultaResponseDTO> consultarPedidosResumidos(String status) {
        return store.buscarPedidosResumidos(status);
    }

    // Busca UM pedido só. Se não existir, dispara o mesmo erro NOT_FOUND
    // (404) que já usamos no PATCH — assim o comportamento fica igual em
    // qualquer rota que precise achar um pedido pelo id.
    public Pedido buscarUm(Long id) {
        return store.buscarPorId(id)
                .orElseThrow(() -> ApiException.naoEncontrado("Pedido não encontrado."));
    }

    public List<Pedido> buscar(String status) {
        List<Pedido> todos = store.listarTodos();
        if (status == null || status.isBlank()) {
            return todos;
        }
        return todos.stream().filter(p -> status.equalsIgnoreCase(p.getStatusPedido())).toList();
    }

    public Pedido registrar(Pedido pedido) {
        if (pedido.getIdCliente() == null
                || pedido.getNomeGerente() == null || pedido.getNomeGerente().isBlank()
                || pedido.getDataPrevista() == null
                || pedido.getFormaEntrega() == null
                || pedido.getItens() == null || pedido.getItens().isEmpty()) {
            throw ApiException.validacao(
                    "idCliente, nomeGerente, dataPrevista, formaEntrega e itens são obrigatórios.");
        }

        if (!"ENTREGA".equalsIgnoreCase(pedido.getFormaEntrega())
                && !"RETIRADA".equalsIgnoreCase(pedido.getFormaEntrega())) {
            throw ApiException.validacao("formaEntrega deve ser ENTREGA ou RETIRADA.");
        }

        if ("ENTREGA".equalsIgnoreCase(pedido.getFormaEntrega())
                && (pedido.getEntregaBairro() == null
                    || pedido.getEntregaRua() == null
                    || pedido.getEntregaNumCasa() == null)) {
            throw ApiException.validacao(
                    "entregaBairro, entregaRua e entregaNumCasa são obrigatórios quando formaEntrega for ENTREGA.");
        }

        LocalDate hoje = LocalDate.now();
        if (pedido.getDataPrevista().toLocalDate().isBefore(hoje)) {
            throw ApiException.validacao("A data prevista não pode ser anterior à data atual.");
        }

        validarItens(pedido.getItens());

        return store.salvar(pedido);
    }

    public Pedido atualizar(Long id, Pedido alteracoes) {
        Pedido existente = store.buscarPorId(id)
                .orElseThrow(() -> ApiException.naoEncontrado("Pedido não encontrado."));

        if (alteracoes.getStatusPedido() != null) {
            String novoStatus = alteracoes.getStatusPedido().toUpperCase();
            if (!STATUS_VALIDOS.contains(novoStatus)) {
                throw ApiException.validacao(
                        "statusPedido deve ser um de: PENDENTE, ATENDIDO, CANCELADO.");
            }
            validarTransicaoDeStatus(existente.getStatusPedido(), novoStatus);
            existente.setStatusPedido(novoStatus);
        }
        if (alteracoes.getDataPrevista() != null) {
            existente.setDataPrevista(alteracoes.getDataPrevista());
        }
        if (alteracoes.getFormaEntrega() != null) {
            existente.setFormaEntrega(alteracoes.getFormaEntrega());
        }

        existente.setAtualizadoEm(LocalDateTime.now());
        return existente;
    }

    private void validarItens(List<ItemPedido> itens) {
        for (ItemPedido item : itens) {
            if (item.getIdProduto() == null) {
                throw ApiException.validacao("idProduto é obrigatório em cada item.");
            }
            // quantidade segue o padrão do banco: default 1, precisa ser > 0
            if (item.getQuantidade() == null) {
                item.setQuantidade(1);
            } else if (item.getQuantidade() <= 0) {
                throw ApiException.validacao("quantidade de cada item deve ser maior que zero.");
            }
            // peso é opcional, mas se informado precisa ser >= 2 (check)
            if (item.getPeso() != null && item.getPeso().compareTo(new BigDecimal("2")) < 0) {
                throw ApiException.validacao("peso de cada item, quando informado, deve ser no mínimo 2 kg.");
            }
        }
    }

    private void validarTransicaoDeStatus(String statusAtual, String novoStatus) {
        // Regra: só pode cancelar se o status atual ainda for PENDENTE.
      
        if ("CANCELADO".equalsIgnoreCase(novoStatus) && !"PENDENTE".equalsIgnoreCase(statusAtual)) {
            throw ApiException.conflito("Só é possível cancelar um pedido que ainda esteja PENDENTE.");
        }
    }
}