package com.gabicake.api.service;

/**
 *
 * @author Sanara Carvalho
 */

import com.gabicake.api.dto.ClienteBuscaResponseDTO;
import com.gabicake.api.entity.ClienteEntity;
import com.gabicake.api.exception.ApiException;
import com.gabicake.api.model.Cliente;
import com.gabicake.api.repository.ClienteRepository;
import com.gabicake.api.store.ClienteMockStore;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService {

    private final ClienteMockStore store;
    private final ClienteRepository repository;

    public ClienteService(ClienteMockStore store, ClienteRepository repository) {
        this.store = store;
        this.repository = repository;
    }

    // GET /clientes/busca: agora consulta o PostgreSQL.
    public List<ClienteBuscaResponseDTO> buscar(String busca) {
        Sort ordem = Sort.by("id");
        List<ClienteEntity> clientes;

        if (busca == null || busca.isBlank()) {
            clientes = repository.findAll(ordem);
        } else if (busca.trim().length() < 3) {
            throw ApiException.validacao("A busca deve possuir pelo menos 3 caracteres.");
        } else {
            String termo = busca.trim();
            clientes = repository.findByNomeContainingIgnoreCaseOrTelefoneContainingIgnoreCase(termo, termo, ordem);
        }

        // O banco guarda um telefone por cliente; o contrato devolve uma lista.
        return clientes.stream()
                .map(c -> new ClienteBuscaResponseDTO(c.getId().longValue(), c.getNome(), List.of(c.getTelefone())))
                .toList();
    }

    // POST /clientes/cadastro continua nos dados fixos (falta decidir a questão dos telefones).
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
