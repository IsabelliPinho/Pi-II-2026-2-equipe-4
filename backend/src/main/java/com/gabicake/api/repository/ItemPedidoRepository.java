package com.gabicake.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.gabicake.api.entity.ItemPedidoEntity;

public interface ItemPedidoRepository
        extends JpaRepository<ItemPedidoEntity, Integer> {

    @EntityGraph(attributePaths = "produto")
    List<ItemPedidoEntity> findByPedidoIdOrderById(Integer pedidoId);
}