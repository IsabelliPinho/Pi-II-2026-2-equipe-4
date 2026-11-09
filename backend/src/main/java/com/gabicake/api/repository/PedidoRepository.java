package com.gabicake.api.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.gabicake.api.entity.PedidoEntity;

public interface PedidoRepository extends JpaRepository<PedidoEntity, Integer> {

    @EntityGraph(attributePaths = {"cliente", "itens", "itens.produto"})
    List<PedidoEntity> findByStatusPedido(String status, Sort sort);

    @Override
    @EntityGraph(attributePaths = {"cliente", "itens", "itens.produto"})
    List<PedidoEntity> findAll(Sort sort);

    @Override
    @EntityGraph(attributePaths = {"cliente", "itens", "itens.produto"})
    Optional<PedidoEntity> findById(Integer id);

    // Agenda: inclui o início e exclui o fim do intervalo.
    @EntityGraph(attributePaths = "cliente")
    @Query("""
        select p from PedidoEntity p
        where p.dataPrevista >= :inicio and p.dataPrevista < :fim
          and p.statusPedido not in ('CANCELADO', 'ATENDIDO', 'ENTREGUE')
        order by p.dataPrevista, p.id
        """)
    List<PedidoEntity> buscarAtivosNoPeriodo(
            @Param("inicio") LocalDateTime inicio,
            @Param("fim") LocalDateTime fim
    );

    // Lembretes: também inclui pedidos exatamente no limite das 48 horas.
    @EntityGraph(attributePaths = "cliente")
    @Query("""
        select p from PedidoEntity p
        where p.dataPrevista >= :inicio and p.dataPrevista <= :fim
          and p.statusPedido not in ('CANCELADO', 'ATENDIDO', 'ENTREGUE')
        order by p.dataPrevista, p.id
        """)
    List<PedidoEntity> buscarProximosDoPrazo(
            @Param("inicio") LocalDateTime inicio,
            @Param("fim") LocalDateTime fim
    );

    @EntityGraph(attributePaths = "cliente")
    @Query("""
        select p from PedidoEntity p
        where p.statusPedido not in ('CANCELADO', 'ATENDIDO', 'ENTREGUE')
        order by p.dataPrevista, p.id
        """)
    List<PedidoEntity> buscarPendentes();
}