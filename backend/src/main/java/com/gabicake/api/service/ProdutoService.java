package com.gabicake.api.service;

import com.gabicake.api.model.Produto;
import com.gabicake.api.repository.ProdutoRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProdutoService {

    private final ProdutoRepository repository;

    public ProdutoService(ProdutoRepository repository) {
        this.repository = repository;
    }

    // Lê do PostgreSQL e devolve no formato do contrato (id, nome, preco).
    public List<Produto> listar() {
        return repository.findAll(Sort.by("id")).stream()
                .map(p -> new Produto(p.getId().longValue(), p.getNome(), p.getPreco()))
                .toList();
    }
}
