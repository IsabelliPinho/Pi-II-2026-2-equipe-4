
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.gabicake.api.service;

/**
 *
 * @author Sanara Carvalho
 */


import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.gabicake.api.dto.PedidoConsultaResponseDTO;
import com.gabicake.api.entity.ClienteEntity;
import com.gabicake.api.entity.ItemPedidoEntity;
import com.gabicake.api.entity.PedidoEntity;
import com.gabicake.api.entity.ProdutoEntity;
import com.gabicake.api.exception.ApiException;
import com.gabicake.api.model.ItemPedido;
import com.gabicake.api.model.Pedido;
import com.gabicake.api.repository.ClienteRepository;
import com.gabicake.api.repository.PedidoRepository;
import com.gabicake.api.repository.ProdutoRepository;

@Service
public class PedidoService {

    private static final Set<String> STATUS_VALIDOS = Set.of("PENDENTE", "ATENDIDO", "CANCELADO");

    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final ProdutoRepository produtoRepository;

    public PedidoService(PedidoRepository pedidoRepository, ClienteRepository clienteRepository, ProdutoRepository produtoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
        this.produtoRepository = produtoRepository;
    }

    // RF010: Consulta resumida de pedidos
    public List<PedidoConsultaResponseDTO> consultarPedidosResumidos(String status) {
        List<PedidoEntity> pedidos = pedidoRepository.findAll(Sort.by("id"));
        return pedidos.stream()
                .filter(p -> status == null || status.isBlank() || status.equalsIgnoreCase(p.getStatusPedido()))
                .map(p -> {
                    PedidoConsultaResponseDTO dto = new PedidoConsultaResponseDTO();
                    dto.setId(p.getId().longValue());
                    dto.setIdCliente(p.getCliente() != null ? p.getCliente().getId().longValue() : null);
                    dto.setNomeCliente(p.getCliente() != null ? p.getCliente().getNome() : null);
                    dto.setNomeGerente(p.getNomeGerente());
                    dto.setDataPedido(p.getDataPedido());
                    dto.setDataPrevista(p.getDataPrevista());
                    dto.setStatusPedido(p.getStatusPedido());
                    dto.setFormaEntrega(p.getFormaEntrega());
                    return dto;
                })
                .toList();
    }
    
    public Pedido buscarUm(Long id) {
        PedidoEntity entity = pedidoRepository.findById(id.intValue())
                .orElseThrow(() -> ApiException.naoEncontrado("Pedido não encontrado."));
        return converterParaModelo(entity);
    }

    public List<Pedido> buscar(String status) {
        List<PedidoEntity> todos = pedidoRepository.findAll(Sort.by("id"));
        if (status == null || status.isBlank()) {
            return todos.stream().map(this::converterParaModelo).toList();
        }
        return todos.stream()
                .filter(p -> status.equalsIgnoreCase(p.getStatusPedido()))
                .map(this::converterParaModelo)
                .toList();
    }

    /**
     * RF003 / RN001 / RN002 / RN003 / RN005:
     * Registo de pedidos com validação de payload, obrigatoriedade de cliente/gerente,
     * prazos, pesos mínimos e modalidades de entrega.
     */
    public Pedido registrar(Pedido pedidoDto) {
        // RN001: Validação da integridade estrutural e campos obrigatórios do payload
        if (pedidoDto.getIdCliente() == null
                || pedidoDto.getNomeGerente() == null || pedidoDto.getNomeGerente().isBlank()
                || pedidoDto.getDataPrevista() == null
                || pedidoDto.getFormaEntrega() == null
                || pedidoDto.getItens() == null || pedidoDto.getItens().isEmpty()) {
            throw ApiException.validacao(
                    "idCliente, nomeGerente, dataPrevista, formaEntrega e itens são obrigatórios.");
        }

        // RN005: Validação da forma de entrega permitida
        if (!"ENTREGA".equalsIgnoreCase(pedidoDto.getFormaEntrega())
                && !"RETIRADA".equalsIgnoreCase(pedidoDto.getFormaEntrega())) {
            throw ApiException.validacao("formaEntrega deve ser ENTREGA ou RETIRADA.");
        }

        // RN005: Validação condicional de morada caso seja ENTREGA
        if ("ENTREGA".equalsIgnoreCase(pedidoDto.getFormaEntrega())
                && (pedidoDto.getEntregaBairro() == null
                    || pedidoDto.getEntregaRua() == null
                    || pedidoDto.getEntregaNumCasa() == null)) {
            throw ApiException.validacao(
                    "entregaBairro, entregaRua e entregaNumCasa são obrigatórios quando formaEntrega for ENTREGA.");
        }

        // RN003: Validação de antecedência mínima (data prevista não pode ser anterior a hoje)
        LocalDate hoje = LocalDate.now();
        if (pedidoDto.getDataPrevista().toLocalDate().isBefore(hoje)) {
            throw ApiException.validacao("A data prevista não pode ser anterior à data atual.");
        }

        // RN003: Validação de quantidades e pesos mínimos dos itens
        validarItens(pedidoDto.getItens());

        // RN002: Associação e rastreabilidade com o cliente cadastrado
        ClienteEntity cliente = clienteRepository.findById(pedidoDto.getIdCliente().intValue())
                .orElseThrow(() -> ApiException.naoEncontrado("Cliente não encontrado."));

        PedidoEntity entity = new PedidoEntity();
        entity.setCliente(cliente);
        entity.setNomeGerente(pedidoDto.getNomeGerente());
        entity.setDataPedido(pedidoDto.getDataPedido() != null ? pedidoDto.getDataPedido() : LocalDate.now());
        entity.setDataPrevista(pedidoDto.getDataPrevista());
        entity.setStatusPedido("PENDENTE"); // Status inicial padrão
        entity.setFormaEntrega(pedidoDto.getFormaEntrega().toUpperCase());
        entity.setEntregaBairro(pedidoDto.getEntregaBairro());
        entity.setEntregaRua(pedidoDto.getEntregaRua());
        entity.setEntregaNumCasa(pedidoDto.getEntregaNumCasa());
        entity.setEntregaCep(pedidoDto.getEntregaCep());

        List<ItemPedidoEntity> itensEntity = pedidoDto.getItens().stream().map(dtoItem -> {
            ProdutoEntity produto = produtoRepository.findById(dtoItem.getIdProduto().intValue())
                    .orElseThrow(() -> ApiException.naoEncontrado("Produto com ID " + dtoItem.getIdProduto() + " não encontrado."));

            ItemPedidoEntity itemEntity = new ItemPedidoEntity();
            itemEntity.setPedido(entity);
            itemEntity.setProduto(produto);
            itemEntity.setQuantidade(dtoItem.getQuantidade());
            itemEntity.setTipoMassa(dtoItem.getTipoMassa());
            itemEntity.setTema(dtoItem.getTema());
            itemEntity.setPeso(dtoItem.getPeso());
            itemEntity.setTipoRecheio(dtoItem.getTipoRecheio());
            return itemEntity;
        }).toList();

        entity.setItens(itensEntity);

        PedidoEntity salvo = pedidoRepository.save(entity);
        return converterParaModelo(salvo);
    }

    /**
     * RF004 / RF009 / RN004:
     * Atualização de pedidos e controlo rigoroso de transição de status (ex: restrição de cancelamento).
     */
    public Pedido atualizar(Long id, Pedido alteracoes) {
        PedidoEntity existente = pedidoRepository.findById(id.intValue())
                .orElseThrow(() -> ApiException.naoEncontrado("Pedido não encontrado."));

        if (alteracoes.getStatusPedido() != null) {
            String novoStatus = alteracoes.getStatusPedido().toUpperCase();
            if (!STATUS_VALIDOS.contains(novoStatus)) {
                throw ApiException.validacao(
                        "statusPedido deve ser um de: PENDENTE, ATENDIDO, CANCELADO.");
            }
            // RN004: Validação de transição de status antes de aplicar alterações
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
        PedidoEntity atualizado = pedidoRepository.save(existente);
        return converterParaModelo(atualizado);
    }

    // RN003: Validação auxiliar de restrições de itens e pesos mínimos
    private void validarItens(List<ItemPedido> itens) {
        for (ItemPedido item : itens) {
            if (item.getIdProduto() == null) {
                throw ApiException.validacao("idProduto é obrigatório em cada item.");
            }
            if (item.getQuantidade() == null) {
                item.setQuantidade(1);
            } else if (item.getQuantidade() <= 0) {
                throw ApiException.validacao("quantidade de cada item deve ser maior que zero.");
            }
            if (item.getPeso() != null && item.getPeso().compareTo(new BigDecimal("2")) < 0) {
                throw ApiException.validacao("peso de cada item, quando informado, deve ser no mínimo 2 kg.");
            }
        }
    }

    // RN004: Regra estrita de restrição de cancelamento (só permite se estiver PENDENTE)
    private void validarTransicaoDeStatus(String statusAtual, String novoStatus) {
        if ("CANCELADO".equalsIgnoreCase(novoStatus) && !"PENDENTE".equalsIgnoreCase(statusAtual)) {
            throw ApiException.conflito("Só é possível cancelar um pedido que ainda esteja PENDENTE.");
        }
    }

    private Pedido converterParaModelo(PedidoEntity entity) {
        Pedido p = new Pedido();
        p.setId(entity.getId().longValue());
        if (entity.getCliente() != null) {
            p.setIdCliente(entity.getCliente().getId().longValue());
        }
        p.setNomeGerente(entity.getNomeGerente());
        p.setDataPedido(entity.getDataPedido());
        p.setDataPrevista(entity.getDataPrevista());
        p.setStatusPedido(entity.getStatusPedido());
        p.setFormaEntrega(entity.getFormaEntrega());
        p.setEntregaBairro(entity.getEntregaBairro());
        p.setEntregaRua(entity.getEntregaRua());
        p.setEntregaNumCasa(entity.getEntregaNumCasa());
        p.setEntregaCep(entity.getEntregaCep());
        p.setAtualizadoEm(entity.getAtualizadoEm());

        if (entity.getItens() != null) {
            List<ItemPedido> itensModel = entity.getItens().stream().map(ie -> {
                ItemPedido item = new ItemPedido();
                if (ie.getProduto() != null) {
                    item.setIdProduto(ie.getProduto().getId().longValue());
                }
                item.setQuantidade(ie.getQuantidade());
                item.setTipoMassa(ie.getTipoMassa());
                item.setTema(ie.getTema());
                item.setPeso(ie.getPeso());
                item.setTipoRecheio(ie.getTipoRecheio());
                return item;
            }).toList();
            p.setItens(itensModel);
        }

        return p;
    }
}