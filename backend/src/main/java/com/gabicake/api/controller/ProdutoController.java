package com.gabicake.api.controller;

/**
 *
 * @author Sanara Carvalho
 */

import com.gabicake.api.model.Produto;
import com.gabicake.api.service.ProdutoService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/listar/produtos")
public class ProdutoController {

    private final ProdutoService service;

    public ProdutoController(ProdutoService service) {
        this.service = service;
    }

    // GET /listar/produtos 
    @GetMapping
    public List<Produto> listar() {
        return service.listar();
    }
}
