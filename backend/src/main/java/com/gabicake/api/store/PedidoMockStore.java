/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.gabicake.api.store;

/**
 *
 * @author Sanara Carvalho
 */

import com.gabicake.api.dto.PedidoConsultaResponseDTO;
import com.gabicake.api.model.Cliente;
import com.gabicake.api.model.ItemPedido;
import com.gabicake.api.model.Pedido;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Component
public class PedidoMockStore {

    private final List<Pedido> pedidos = new ArrayList<>();
    private final AtomicLong sequencia = new AtomicLong(100);
    private final ClienteMockStore clienteMockStore;

    public PedidoMockStore(ClienteMockStore clienteMockStore) {
        this.clienteMockStore = clienteMockStore;

        ItemPedido item1 = new ItemPedido();
        item1.setIdProduto(10L);
        item1.setQuantidade(1);
        item1.setTipoMassa("Chocolate");
        item1.setTema("Aniversário");
        item1.setPeso(new BigDecimal("2.5"));
        item1.setTipoRecheio("Brigadeiro");

        Pedido p1 = new Pedido();
        p1.setId(sequencia.getAndIncrement());
        p1.setIdCliente(1L);
        p1.setNomeGerente("Gabriela");
        p1.setDataPedido(LocalDate.of(2026, 9, 20));
        p1.setDataPrevista(LocalDateTime.of(2026, 9, 25, 15, 0));
        p1.setStatusPedido("PENDENTE");
        p1.setFormaEntrega("ENTREGA");
        p1.setEntregaBairro("Centro");
        p1.setEntregaRua("Rua das Flores");
        p1.setEntregaNumCasa("120");
        p1.setEntregaCep("60000-000");
        p1.setItens(List.of(item1));
        pedidos.add(p1);

        ItemPedido item2 = new ItemPedido();
        item2.setIdProduto(11L);
        item2.setQuantidade(1);
        item2.setTipoMassa("Baunilha");
        item2.setTema("Casamento");
        item2.setPeso(new BigDecimal("3.0"));
        item2.setTipoRecheio("Morango");

        Pedido p2 = new Pedido();
        p2.setId(sequencia.getAndIncrement());
        p2.setIdCliente(2L);
        p2.setNomeGerente("Gabriela");
        p2.setDataPedido(LocalDate.of(2026, 9, 18));
        p2.setDataPrevista(LocalDateTime.of(2026, 9, 22, 10, 0));
        p2.setStatusPedido("ATENDIDO");
        p2.setFormaEntrega("RETIRADA");
        p2.setItens(List.of(item2));
        pedidos.add(p2);
    }

    public List<Pedido> listarTodos() {
        return pedidos;
    }

    public Optional<Pedido> buscarPorId(Long id) {
        return pedidos.stream().filter(p -> p.getId().equals(id)).findFirst();
    }

    public Pedido salvar(Pedido pedido) {
        pedido.setId(sequencia.getAndIncrement());
        pedido.setDataPedido(LocalDate.now());
        pedido.setStatusPedido("PENDENTE");
        pedidos.add(pedido);
        return pedido;
    }

    public List<PedidoConsultaResponseDTO> buscarPedidosResumidos(String status) {
        return pedidos.stream()
            .filter(p -> status == null || status.isBlank() || p.getStatusPedido().equalsIgnoreCase(status))
            .map(p -> {
                String nomeCliente = clienteMockStore.listarTodos().stream()
                        .filter(c -> c.getId().equals(p.getIdCliente()))
                        .map(Cliente::getNome)
                        .findFirst()
                        .orElse("Cliente Não Encontrado");

                return new PedidoConsultaResponseDTO(
                    p.getId(),
                    nomeCliente,
                    p.getDataPrevista(),
                    p.getFormaEntrega(),
                    p.getStatusPedido()
                );
            })
            .collect(Collectors.toList());
    }
}