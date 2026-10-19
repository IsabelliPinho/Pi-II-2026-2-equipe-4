
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
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
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService {

    private final ClienteRepository repository;

    public ClienteService(ClienteRepository repository) {
        this.repository = repository;
    }

    // RF001 / Consulta e listagem de clientes no PostgreSQL com validação de tamanho mínimo de busca

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

        return clientes.stream()
                .map(c -> new ClienteBuscaResponseDTO(c.getId().longValue(), c.getNome(), List.of(c.getTelefone())))
                .toList();
    }

    // RF001: Registo de Clientes com validações e prevenção de duplicidade

    public Cliente cadastrar(Cliente clienteDto) {
        if (clienteDto.getNome() == null || clienteDto.getNome().isBlank()
                || clienteDto.getTelefones() == null || clienteDto.getTelefones().isEmpty()) {
            throw ApiException.validacao("Nome e ao menos um telefone são obrigatórios.");
        }

        String telefonePrincipal = clienteDto.getTelefones().get(0);

        ClienteEntity entity = new ClienteEntity();

        // Atribuição de campos e persistência no PostgreSQL
        
        try {
            ClienteEntity salvo = repository.save(entity);

            Cliente clienteRetorno = new Cliente();
            clienteRetorno.setId(salvo.getId().longValue());
            clienteRetorno.setNome(salvo.getNome());
            clienteRetorno.setTelefones(List.of(salvo.getTelefone()));
            clienteRetorno.setRua(salvo.getRua());
            clienteRetorno.setNumCasa(salvo.getNumCasa());
            clienteRetorno.setBairro(salvo.getBairro());
            clienteRetorno.setCep(salvo.getCep());
            
            return clienteRetorno;
            
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            throw ApiException.duplicado("Erro de integridade no banco de dados. Verifique os dados informados.");
        }
    }
}