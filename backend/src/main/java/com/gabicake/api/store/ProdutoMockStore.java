/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.gabicake.api.store;

/**
 *
 * @author Sanara Carvalho
 */

import com.gabicake.api.model.Produto;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

// "Banco de dados" fixo em memória para produtos. Os IDs 10 e 11 aqui são
// os MESMOS que já aparecem nos exemplos de pedido no contrato — assim os
// exemplos continuam fazendo sentido entre as rotas.
@Component
public class ProdutoMockStore {

    private final List<Produto> produtos = List.of(
            new Produto(10L, "Bolo de Chocolate", new BigDecimal("80.00")),
            new Produto(11L, "Bolo de Baunilha", new BigDecimal("70.00"))
    );

    public List<Produto> listarTodos() {
        return produtos;
    }
}
