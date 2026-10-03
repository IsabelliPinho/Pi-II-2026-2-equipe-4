/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.gabicake.api.service;

/**
 *
 * @author Sanara Carvalho
 */

import com.gabicake.api.dto.ClienteBuscaResponseDTO; // adicionei 
import com.gabicake.api.exception.ApiException;
import com.gabicake.api.model.Cliente;
import com.gabicake.api.store.ClienteMockStore;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService {

    private final ClienteMockStore store;

    public ClienteService(ClienteMockStore store) {
        this.store = store;
    }

    // [ALTERADO] Tipo de retorno alterado para List<ClienteBuscaResponseDTO>
    public List<ClienteBuscaResponseDTO> buscar(String busca) {
        List<Cliente> clientes;

        if (busca == null || busca.isBlank()) {
            clientes = store.listarTodos();
        } else if (busca.trim().length() < 3) {
            throw ApiException.validacao("A busca deve possuir pelo menos 3 caracteres.");
        } else {
            String termo = busca.trim().toLowerCase();
            clientes = store.listarTodos().stream()
                    .filter(c -> (c.getNome() != null && c.getNome().toLowerCase().contains(termo))
                            || (c.getTelefones() != null && c.getTelefones().stream()
                                    .anyMatch(t -> t.toLowerCase().contains(termo))))
                    .toList();
        }

        // adicionei o marpemento de busca que tava retornando coisa errada 
        return clientes.stream()
                .map(c -> new ClienteBuscaResponseDTO(
                        c.getId(),
                        c.getNome(),
                        c.getTelefones()
                ))
                .toList();
    }

    public Cliente cadastrar(Cliente cliente) {
        if (cliente.getNome() == null || cliente.getNome().isBlank()
                || cliente.getTelefones() == null || cliente.getTelefones().isEmpty()) {
            throw ApiException.validacao("Nome e ao menos um telefone são obrigatórios.");
        }
        for (String telefone : cliente.getTelefones()) {
            if (store.existeTelefone(telefone)) {
                throw ApiException.duplicado("Já existe um cliente cadastrado com o telefone " + telefone + ".");
            }
        }
        return store.salvar(cliente);
    }
}