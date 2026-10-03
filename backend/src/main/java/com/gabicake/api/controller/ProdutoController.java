/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.gabicake.api.controller;

/**
 *
 * @author Sanara Carvalho
 */

import com.gabicake.api.model.Produto;
import com.gabicake.api.store.ProdutoMockStore;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/listar/produtos")
public class ProdutoController {

    private final ProdutoMockStore store;

    public ProdutoController(ProdutoMockStore store) {
        this.store = store;
    }

    // GET /listar/produtos
    @GetMapping
    public List<Produto> listar() {
        return store.listarTodos();
    }
}
