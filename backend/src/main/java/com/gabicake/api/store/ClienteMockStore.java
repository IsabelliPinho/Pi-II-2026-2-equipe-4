/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.gabicake.api.store;

/**
 *
 * @author Sanara Carvalho
 */
import com.gabicake.api.model.Cliente;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

/**
 * "Banco de dados" fixo em memória, com os mesmos campos da tabela
 * cliente + telefone_cliente do banco real.
 */
@Component
public class ClienteMockStore {

    private final List<Cliente> clientes = new ArrayList<>();
    private final AtomicLong sequencia = new AtomicLong(1);

    public ClienteMockStore() {
        Cliente c1 = new Cliente();
        c1.setId(sequencia.getAndIncrement());
        c1.setNome("Maria da Silva");
        c1.setTelefones(List.of("(85) 99999-1111", "(85) 98888-2222"));
        c1.setBairro("Centro");
        c1.setRua("Rua das Flores");
        c1.setNumCasa("120");
        c1.setCep("60000-000");
        clientes.add(c1);

        Cliente c2 = new Cliente();
        c2.setId(sequencia.getAndIncrement());
        c2.setNome("João Pereira");
        c2.setTelefones(List.of("(85) 97777-3333"));
        c2.setBairro("Meireles");
        c2.setRua("Av. Beira Mar");
        c2.setNumCasa("500");
        c2.setCep("60165-121");
        clientes.add(c2);
    }

    public List<Cliente> listarTodos() {
        return clientes;
    }

    public boolean existeTelefone(String telefone) {
        return clientes.stream()
                .anyMatch(c -> c.getTelefones() != null && c.getTelefones().contains(telefone));
    }

    public Cliente salvar(Cliente cliente) {
        cliente.setId(sequencia.getAndIncrement());
        clientes.add(cliente);
        return cliente;
    }
}
