package com.gabicake.api.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gabicake.api.dto.PedidoConsultaResponseDTO;
import com.gabicake.api.dto.VerificacaoEntregaDTO;
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
@Transactional(readOnly = true)
public class PedidoService {

    private static final Set<String> STATUS_VALIDOS =
            Set.of("PENDENTE", "ATENDIDO", "CANCELADO");

    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final ProdutoRepository produtoRepository;

    public PedidoService(
            PedidoRepository pedidoRepository,
            ClienteRepository clienteRepository,
            ProdutoRepository produtoRepository
    ) {
        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
        this.produtoRepository = produtoRepository;
    }

    public List<PedidoConsultaResponseDTO> consultarPedidosResumidos(String status) {
        List<PedidoEntity> pedidos = (status == null || status.isBlank())
                ? pedidoRepository.findAll(Sort.by("id"))
                : pedidoRepository.findByStatusPedido(
                        status.trim().toUpperCase(),
                        Sort.by("id")
                );

        return pedidos.stream()
                .map(p -> {
                    PedidoConsultaResponseDTO dto = new PedidoConsultaResponseDTO();
                    dto.setId(p.getId().longValue());
                    dto.setIdCliente(
                            p.getCliente() != null
                                    ? p.getCliente().getId().longValue()
                                    : null
                    );
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
                .orElseThrow(
                        () -> ApiException.naoEncontrado("Pedido não encontrado.")
                );

        return converterParaModelo(entity);
    }

    public List<Pedido> buscar(String status) {
        List<PedidoEntity> pedidos = (status == null || status.isBlank())
                ? pedidoRepository.findAll(Sort.by("id"))
                : pedidoRepository.findByStatusPedido(
                        status.trim().toUpperCase(),
                        Sort.by("id")
                );

        return pedidos.stream()
                .map(this::converterParaModelo)
                .toList();
    }

    @Transactional
    public Pedido registrar(Pedido pedidoDto) {
        if (pedidoDto.getDesconto() == null) {
            pedidoDto.setDesconto(BigDecimal.ZERO);
        }

        validarDesconto(pedidoDto.getDesconto());

        if (pedidoDto.getIdCliente() == null
                || pedidoDto.getNomeGerente() == null
                || pedidoDto.getNomeGerente().isBlank()
                || pedidoDto.getDataPrevista() == null
                || pedidoDto.getFormaEntrega() == null
                || pedidoDto.getItens() == null
                || pedidoDto.getItens().isEmpty()) {
            throw ApiException.validacao(
                    "idCliente, nomeGerente, dataPrevista, formaEntrega e itens são obrigatórios."
            );
        }

        if (!"ENTREGA".equalsIgnoreCase(pedidoDto.getFormaEntrega())
                && !"RETIRADA".equalsIgnoreCase(pedidoDto.getFormaEntrega())) {
            throw ApiException.validacao(
                    "formaEntrega deve ser ENTREGA ou RETIRADA."
            );
        }

        if ("ENTREGA".equalsIgnoreCase(pedidoDto.getFormaEntrega())
                && (pedidoDto.getEntregaBairro() == null
                || pedidoDto.getEntregaRua() == null
                || pedidoDto.getEntregaNumCasa() == null
                || pedidoDto.getEntregaCep() == null)) {
            throw ApiException.validacao(
                    "entregaBairro, entregaRua, entregaNumCasa e entregaCep são obrigatórios quando formaEntrega for ENTREGA."
            );
        }

        LocalDate hoje = LocalDate.now();

        if (pedidoDto.getDataPrevista().toLocalDate().isBefore(hoje)) {
            throw ApiException.validacao(
                    "A data prevista não pode ser anterior à data atual."
            );
        }

        validarItens(pedidoDto.getItens());

        ClienteEntity cliente = clienteRepository
                .findById(pedidoDto.getIdCliente().intValue())
                .orElseThrow(
                        () -> ApiException.naoEncontrado("Cliente não encontrado.")
                );

        PedidoEntity entity = new PedidoEntity();
        entity.setCliente(cliente);
        entity.setDesconto(pedidoDto.getDesconto());
        entity.setNomeGerente(pedidoDto.getNomeGerente());
        entity.setDataPedido(
                pedidoDto.getDataPedido() != null
                        ? pedidoDto.getDataPedido()
                        : LocalDate.now()
        );
        entity.setDataPrevista(pedidoDto.getDataPrevista());
        entity.setStatusPedido("PENDENTE");
        entity.setFormaEntrega(pedidoDto.getFormaEntrega().toUpperCase());
        entity.setEntregaBairro(pedidoDto.getEntregaBairro());
        entity.setEntregaRua(pedidoDto.getEntregaRua());
        entity.setEntregaNumCasa(pedidoDto.getEntregaNumCasa());
        entity.setEntregaCep(pedidoDto.getEntregaCep());

        List<ItemPedidoEntity> itensEntity = pedidoDto.getItens().stream()
                .map(dtoItem -> {
                    ProdutoEntity produto = produtoRepository
                            .findById(dtoItem.getIdProduto().intValue())
                            .orElseThrow(
                                    () -> ApiException.naoEncontrado(
                                            "Produto com ID "
                                                    + dtoItem.getIdProduto()
                                                    + " não encontrado."
                                    )
                            );

                    ItemPedidoEntity itemEntity = new ItemPedidoEntity();
                    itemEntity.setPedido(entity);
                    itemEntity.setProduto(produto);
                    itemEntity.setQuantidade(dtoItem.getQuantidade());
                    itemEntity.setTipoMassa(dtoItem.getTipoMassa());
                    itemEntity.setTema(dtoItem.getTema());
                    itemEntity.setPeso(dtoItem.getPeso());
                    itemEntity.setTipoRecheio(dtoItem.getTipoRecheio());

                    return itemEntity;
                })
                .toList();

        entity.setItens(itensEntity);

        PedidoEntity salvo = pedidoRepository.saveAndFlush(entity);
        return converterParaModelo(salvo);
    }

    @Transactional
    public Pedido atualizar(Long id, Pedido alteracoes) {
        PedidoEntity existente = pedidoRepository.findById(id.intValue())
                .orElseThrow(
                        () -> ApiException.naoEncontrado("Pedido não encontrado.")
                );

        if (alteracoes.getDesconto() != null) {
            validarDesconto(alteracoes.getDesconto());
            existente.setDesconto(alteracoes.getDesconto());
        }

        if (alteracoes.getStatusPedido() != null) {
            String novoStatus = alteracoes.getStatusPedido().toUpperCase();

            if (!STATUS_VALIDOS.contains(novoStatus)) {
                throw ApiException.validacao(
                        "statusPedido deve ser um de: PENDENTE, ATENDIDO, CANCELADO."
                );
            }

            validarTransicaoDeStatus(
                    existente.getStatusPedido(),
                    novoStatus
            );

            existente.setStatusPedido(novoStatus);
        }

        if (alteracoes.getDataPrevista() != null) {
            existente.setDataPrevista(alteracoes.getDataPrevista());
        }

        if (alteracoes.getFormaEntrega() != null) {
            existente.setFormaEntrega(alteracoes.getFormaEntrega());
        }

        existente.setAtualizadoEm(LocalDateTime.now());

        PedidoEntity atualizado = pedidoRepository.saveAndFlush(existente);
        return converterParaModelo(atualizado);
    }

    private void validarItens(List<ItemPedido> itens) {
        for (ItemPedido item : itens) {
            if (item.getIdProduto() == null) {
                throw ApiException.validacao(
                        "idProduto é obrigatório em cada item."
                );
            }

            if (item.getQuantidade() == null) {
                item.setQuantidade(1);
            } else if (item.getQuantidade() <= 0) {
                throw ApiException.validacao(
                        "quantidade de cada item deve ser maior que zero."
                );
            }

            if (item.getPeso() != null
                    && item.getPeso().compareTo(new BigDecimal("2")) < 0) {
                throw ApiException.validacao(
                        "peso de cada item, quando informado, deve ser no mínimo 2 kg."
                );
            }
        }
    }

    private void validarTransicaoDeStatus(String statusAtual, String novoStatus) {
        if ("CANCELADO".equalsIgnoreCase(novoStatus)
                && !"PENDENTE".equalsIgnoreCase(statusAtual)) {
            throw ApiException.conflito(
                    "Só é possível cancelar um pedido que ainda esteja PENDENTE."
            );
        }
    }

    private void validarDesconto(BigDecimal desconto) {
        if (desconto == null
                || desconto.signum() < 0
                || desconto.scale() > 2
                || desconto.compareTo(new BigDecimal("99999999.99")) > 0) {
            throw ApiException.validacao(
                    "desconto deve ser um valor não negativo com até duas casas decimais."
            );
        }
    }

    private Pedido converterParaModelo(PedidoEntity entity) {
        Pedido p = new Pedido();
        p.setId(entity.getId().longValue());
        p.setDesconto(entity.getDesconto());

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
            List<ItemPedido> itensModel = entity.getItens().stream()
                    .map(ie -> {
                        ItemPedido item = new ItemPedido();

                        if (ie.getProduto() != null) {
                            item.setIdProduto(
                                    ie.getProduto().getId().longValue()
                            );
                        }

                        item.setQuantidade(ie.getQuantidade());
                        item.setTipoMassa(ie.getTipoMassa());
                        item.setTema(ie.getTema());
                        item.setPeso(ie.getPeso());
                        item.setTipoRecheio(ie.getTipoRecheio());

                        return item;
                    })
                    .toList();

            p.setItens(itensModel);
        }

        return p;
    }

    public Map<String, Object> consultarAgenda(String dataStr) {
        LocalDate dia = LocalDate.parse(dataStr);

        List<PedidoEntity> pedidos = pedidoRepository.buscarAtivosNoPeriodo(
                dia.atStartOfDay(),
                dia.plusDays(1).atStartOfDay()
        );

        List<Map<String, Object>> listaPedidos = pedidos.stream()
                .map(p -> {
                    Map<String, Object> dto = new HashMap<>();
                    dto.put("id", p.getId());
                    dto.put(
                            "nomeCliente",
                            p.getCliente() != null
                                    ? p.getCliente().getNome()
                                    : "Desconhecido"
                    );
                    dto.put("formaEntrega", p.getFormaEntrega());
                    dto.put("statusPedido", p.getStatusPedido());
                    return dto;
                })
                .collect(Collectors.toList());

        Map<String, Object> resposta = new HashMap<>();
        resposta.put("data", dataStr);
        resposta.put("pedidos", listaPedidos);

        return resposta;
    }

    public List<Map<String, Object>> listarPedidosProximos(int diasLimite) {
        LocalDate hoje = LocalDate.now();
        LocalDateTime agora = LocalDateTime.now();
        LocalDateTime limite = agora.plusDays(diasLimite);

        List<PedidoEntity> pedidos = pedidoRepository.buscarProximosDoPrazo(
                agora,
                limite
        );

        return pedidos.stream()
                .filter(p -> {
                    if (p.getDataPrevista() == null) {
                        return false;
                    }

                    LocalDate dataPrevista = p.getDataPrevista().toLocalDate();

                    return !dataPrevista.isBefore(hoje)
                            && !dataPrevista.isAfter(limite.toLocalDate());
                })
                .map(p -> {
                    LocalDate dataPrevista = p.getDataPrevista().toLocalDate();
                    long diasRestantes = ChronoUnit.DAYS.between(
                            hoje,
                            dataPrevista
                    );

                    Map<String, Object> dto = new HashMap<>();
                    dto.put("id", p.getId());
                    dto.put(
                            "nomeCliente",
                            p.getCliente() != null
                                    ? p.getCliente().getNome()
                                    : "Desconhecido"
                    );
                    dto.put("dataPrevista", p.getDataPrevista().toString());
                    dto.put("diasRestantes", (int) diasRestantes);

                    return dto;
                })
                .collect(Collectors.toList());
    }

    public Map<String, Object> verificarRaioEntrega(
            VerificacaoEntregaDTO endereco
    ) {
        // Implementação provisória já existente no projeto.
        List<String> bairrosAtendidos = Arrays.asList(
                "Centro",
                "Planalto",
                "Fátima I ",
                "São vicente"
        );

        boolean dentroDoRaio = endereco.getBairro() != null
                && bairrosAtendidos.stream().anyMatch(
                        b -> b.equalsIgnoreCase(endereco.getBairro().trim())
                );

        Map<String, Object> resposta = new HashMap<>();

        if (dentroDoRaio) {
            resposta.put("disponivel", true);
            resposta.put("mensagem", "A entrega é possível para este endereço.");
        } else {
            resposta.put("disponivel", false);
            resposta.put(
                    "mensagem",
                    "A distância ultrapassa o limite estabelecido. Recomenda-se a retirada na loja."
            );
        }

        return resposta;
    }
}