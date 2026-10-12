package com.gabicake.api.service;

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

    // Lê do PostgreSQL através do repositório e mapeia para o modelo de contrato (Produto).
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