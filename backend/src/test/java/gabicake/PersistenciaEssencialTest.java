package gabicake;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.gabicake.api.entity.ClienteEntity;
import com.gabicake.api.entity.ConfiguracaoLojaEntity;
import com.gabicake.api.entity.ItemPedidoEntity;
import com.gabicake.api.entity.PedidoEntity;
import com.gabicake.api.entity.ProdutoEntity;
import com.gabicake.api.entity.SessaoEntity;
import com.gabicake.api.entity.UsuarioEntity;
import com.gabicake.api.repository.ConfiguracaoLojaRepository;
import com.gabicake.api.repository.ItemPedidoRepository;
import com.gabicake.api.repository.PedidoRepository;
import com.gabicake.api.repository.SessaoRepository;
import com.gabicake.api.repository.UsuarioRepository;

import jakarta.persistence.EntityManager;

@SpringBootTest(properties = {
    "spring.datasource.url=${PG_TEST_URL:jdbc:h2:mem:essenciais;MODE=PostgreSQL;DB_CLOSE_DELAY=-1}",
    "spring.datasource.driver-class-name=${PG_TEST_DRIVER:org.h2.Driver}",
    "spring.jpa.database-platform=${PG_TEST_DIALECT:org.hibernate.dialect.H2Dialect}",
    "spring.jpa.hibernate.ddl-auto=${PG_TEST_DDL:create-drop}",
    "spring.jpa.show-sql=false"
})
@Transactional
class PersistenciaEssencialTest {

    @Autowired
    EntityManager em;

    @Autowired
    PedidoRepository pedidos;

    @Autowired
    ItemPedidoRepository itens;

    @Autowired
    ConfiguracaoLojaRepository configuracoes;

    @Autowired
    SessaoRepository sessoes;

    @Autowired
    UsuarioRepository usuarios;

    private PedidoEntity pedido(LocalDateTime data, String status) {
        ClienteEntity cliente = new ClienteEntity();
        cliente.setNome("Cliente teste");
        cliente.setTelefone("(88) 99999-1111");
        cliente.setRua("Rua A");
        cliente.setNumCasa("10");
        cliente.setBairro("Centro");
        cliente.setCep("63000-000");
        em.persist(cliente);

        PedidoEntity pedido = new PedidoEntity();
        pedido.setCliente(cliente);
        pedido.setNomeGerente("Gerente teste");
        pedido.setDataPrevista(data);
        pedido.setFormaEntrega("RETIRADA");
        pedido.setStatusPedido(status);
        pedido.setDesconto(new BigDecimal("5.50"));

        return pedido;
    }

    @Test
    void preservaHorarioDescontoMetadadosEItensAposRecarregar() {
        LocalDateTime data = LocalDateTime.of(2027, 3, 10, 15, 45);
        PedidoEntity pedido = pedido(data, "PENDENTE");

        em.createNativeQuery(
                "insert into produto(nome, preco) values ('Bolo teste', 80.00)"
        ).executeUpdate();

        ProdutoEntity produto = em.createQuery(
                "select p from ProdutoEntity p where p.nome = 'Bolo teste'",
                ProdutoEntity.class
        ).getSingleResult();

        ItemPedidoEntity item = new ItemPedidoEntity();
        item.setProduto(produto);
        item.setQuantidade(2);
        item.setPeso(new BigDecimal("2.125"));

        pedido.setItens(List.of(item));
        pedidos.saveAndFlush(pedido);

        Integer id = pedido.getId();
        em.clear();

        PedidoEntity salvo = pedidos.findById(id).orElseThrow();

        assertEquals(data, salvo.getDataPrevista());
        assertEquals("Gerente teste", salvo.getNomeGerente());
        assertEquals(new BigDecimal("5.50"), salvo.getDesconto());
        assertNotNull(salvo.getDataPedido());
        assertNotNull(salvo.getAtualizadoEm());

        assertEquals(
                new BigDecimal("2.125"),
                salvo.getItens().getFirst().getPeso()
        );

        assertEquals(
                id,
                itens.findByPedidoIdOrderById(id)
                        .getFirst()
                        .getPedido()
                        .getId()
        );

        salvo.setItens(List.of());
        pedidos.flush();
        em.clear();

        assertTrue(itens.findByPedidoIdOrderById(id).isEmpty());
    }

    @Test
    void agendaEPendentesExcluemFinalizadosEOrdenamPorHorario() {
        LocalDateTime inicio = LocalDateTime.of(2027, 3, 10, 0, 0);

        PedidoEntity depois = pedidos.save(
                pedido(inicio.plusHours(15), "PENDENTE")
        );

        PedidoEntity antes = pedidos.save(
                pedido(inicio.plusHours(8), "PENDENTE")
        );

        pedidos.save(pedido(inicio.plusHours(9), "CANCELADO"));

        PedidoEntity atendido = pedidos.save(
                pedido(inicio.plusHours(10), "ATENDIDO")
        );

        pedidos.save(pedido(inicio.plusDays(1), "PENDENTE"));

        pedidos.flush();
        em.clear();

        assertEquals(
                List.of(antes.getId(), depois.getId()),
                pedidos.buscarAtivosNoPeriodo(inicio, inicio.plusDays(1))
                        .stream()
                        .map(PedidoEntity::getId)
                        .toList()
        );

        assertEquals(3, pedidos.buscarPendentes().size());

        assertEquals(
                3,
                pedidos.buscarProximosDoPrazo(
                        inicio,
                        inicio.plusDays(1)
                ).size()
        );

        assertNotNull(
                pedidos.findById(atendido.getId())
                        .orElseThrow()
                        .getDataEntrega()
        );
    }

    @Test
    void configuracaoUnicaPersisteCamposDaLoja() {
        ConfiguracaoLojaEntity config = new ConfiguracaoLojaEntity();
        config.setEnderecoLoja("Rua da loja, 100");
        config.setLatitude(new BigDecimal("-7.230000"));
        config.setLongitude(new BigDecimal("-39.410000"));
        config.setRaioEntregaKm(new BigDecimal("5.500"));
        config.setAntecedenciaMinimaHoras(48);
        config.setUrlPlanilhaFinanceira(
                "https://docs.google.com/spreadsheets/d/teste/edit"
        );

        configuracoes.saveAndFlush(config);
        em.clear();

        ConfiguracaoLojaEntity salvo =
                configuracoes.buscarConfiguracao().orElseThrow();

        assertEquals(
                new BigDecimal("5.500"),
                salvo.getRaioEntregaKm()
        );

        assertEquals(48, salvo.getAntecedenciaMinimaHoras());

        assertEquals(
                config.getUrlPlanilhaFinanceira(),
                salvo.getUrlPlanilhaFinanceira()
        );

        salvo.setRaioEntregaKm(new BigDecimal("6.000"));
        configuracoes.flush();
        em.clear();

        assertEquals(1, configuracoes.count());

        assertEquals(
                new BigDecimal("6.000"),
                configuracoes.buscarConfiguracao()
                        .orElseThrow()
                        .getRaioEntregaKm()
        );
    }

    @Test
    void sessoesFiltramExpiracaoRevogacaoInatividadeEUsuarioInativo() {
        UsuarioEntity usuario = new UsuarioEntity();
        usuario.setLogin("teste");
        usuario.setNome("Teste");
        usuario.setSenhaHash(
                "$2a$10$8qCKy6OgZyFtylNBpbezyeoYlKXKfdEf3YZMQmATeeOz6x/r9c2ae"
        );
        usuario.setTentativasFalhas(3);

        LocalDateTime agora = LocalDateTime.of(2027, 3, 10, 12, 0);
        usuario.setBloqueadoAte(agora.plusMinutes(5));
        usuarios.saveAndFlush(usuario);

        SessaoEntity sessao = new SessaoEntity();
        sessao.setUsuario(usuario);
        sessao.setTokenHash("a".repeat(64));
        sessao.setCriadaEm(agora.minusHours(1));
        sessao.setUltimoAcessoEm(agora);
        sessao.setExpiraEm(agora.plusHours(1));

        sessoes.saveAndFlush(sessao);
        em.clear();

        assertEquals(
                3,
                usuarios.buscarParaAutenticacao("teste")
                        .orElseThrow()
                        .getTentativasFalhas()
        );

        assertEquals(
                agora.plusMinutes(5),
                usuarios.findById(usuario.getId())
                        .orElseThrow()
                        .getBloqueadoAte()
        );

        assertTrue(
                sessoes.buscarValida(
                        "a".repeat(64), agora, agora.minusMinutes(30)
                ).isPresent()
        );

        assertTrue(
                sessoes.buscarValida(
                        "a".repeat(64),
                        agora.plusHours(1),
                        agora.minusMinutes(30)
                ).isEmpty()
        );

        assertTrue(
                sessoes.buscarValida(
                        "a".repeat(64), agora, agora
                ).isEmpty()
        );

        assertTrue(
                sessoes.buscarValida(
                        "b".repeat(64), agora, agora.minusMinutes(30)
                ).isEmpty()
        );

        SessaoEntity salvo = sessoes.findById(sessao.getId()).orElseThrow();
        salvo.setRevogadaEm(agora);
        sessoes.flush();

        assertTrue(
                sessoes.buscarValida(
                        "a".repeat(64), agora, agora.minusMinutes(30)
                ).isEmpty()
        );

        salvo.setRevogadaEm(null);
        salvo.getUsuario().setAtivo(false);
        sessoes.flush();

        assertTrue(
                sessoes.buscarValida(
                        "a".repeat(64), agora, agora.minusMinutes(30)
                ).isEmpty()
        );
    }
}