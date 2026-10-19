
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.gabicake.api.service;

/**
 *
 * @author Sanara Carvalho
 */

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.gabicake.api.entity.ProdutoEntity;
import com.gabicake.api.model.Produto;
import com.gabicake.api.repository.ProdutoRepository;

@Service
public class ProdutoService {

    private final ProdutoRepository repository;

    public ProdutoService(ProdutoRepository repository) {
        this.repository = repository;
    }

    /**
     * Consulta o catálogo de produtos no PostgreSQL.
     * Correlacionado à listagem e seleção de itens para composição de pedidos.
     */
    public List<Produto> listar() {
        List<ProdutoEntity> entidades = repository.findAll(Sort.by("id"));
        
        return entidades.stream()
                .map(p -> new Produto(
                    p.getId().longValue(), 
                    p.getNome(), 
                    p.getPreco()
                ))
                .toList();
    }
}