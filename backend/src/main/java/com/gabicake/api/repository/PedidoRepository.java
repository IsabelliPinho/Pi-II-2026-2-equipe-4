package com.gabicake.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.domain.Sort;
import com.gabicake.api.entity.PedidoEntity;

@Repository
public interface PedidoRepository extends JpaRepository<PedidoEntity, Integer> {

 // Método que permite ao Spring filtrar por status usando o índice do banco
    List<PedidoEntity> findByStatusPedido(String statusPedido, Sort sort);

}


