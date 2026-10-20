
package com.gabicake.api.service;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.gabicake.api.dto.ClienteBuscaResponseDTO;
import com.gabicake.api.entity.ClienteEntity;
import com.gabicake.api.exception.ApiException;
import com.gabicake.api.model.Cliente;
import com.gabicake.api.repository.ClienteRepository;

@Service
public class ClienteService {

    private final ClienteRepository repository;

    public ClienteService(ClienteRepository repository) {
        this.repository = repository;
    }

    public List<ClienteBuscaResponseDTO> buscar(String busca) {
        Sort ordem = Sort.by("id");
        List<ClienteEntity> clientes;

        if (busca == null || busca.isBlank()) {
            clientes = repository.findAll(ordem);
        } else if (busca.trim().length() < 3) {
            throw ApiException.validacao(
                "A busca deve possuir pelo menos 3 caracteres."
            );
        } else {
            String termo = busca.trim();

            clientes = repository
                .findByNomeContainingIgnoreCaseOrTelefoneContainingIgnoreCase(
                    termo, termo, ordem
                );
        }

        return clientes.stream()
            .map(c -> new ClienteBuscaResponseDTO(
                c.getId().longValue(),
                c.getNome(),
                List.of(c.getTelefone())
            ))
            .toList();
    }

    public Cliente cadastrar(Cliente clienteDto) {
        if (clienteDto == null) {
            throw ApiException.validacao(
                "Os dados do cliente são obrigatórios."
            );
        }

        if (clienteDto.getNome() == null
                || clienteDto.getNome().isBlank()) {
            throw ApiException.validacao(
                "O nome do cliente é obrigatório."
            );
        }

        if (clienteDto.getTelefones() == null
                || clienteDto.getTelefones().isEmpty()
                || clienteDto.getTelefones().get(0) == null
                || clienteDto.getTelefones().get(0).isBlank()) {
            throw ApiException.validacao(
                "Informe ao menos um telefone válido."
            );
        }

        if (clienteDto.getRua() == null
                || clienteDto.getRua().isBlank()
                || clienteDto.getNumCasa() == null
                || clienteDto.getNumCasa().isBlank()
                || clienteDto.getBairro() == null
                || clienteDto.getBairro().isBlank()
                || clienteDto.getCep() == null
                || clienteDto.getCep().isBlank()) {
            throw ApiException.validacao(
                "Rua, número da casa, bairro e CEP são obrigatórios."
            );
        }

        ClienteEntity entity = new ClienteEntity();

        entity.setNome(clienteDto.getNome().trim());
        entity.setTelefone(
            clienteDto.getTelefones().get(0).trim()
        );
        entity.setRua(clienteDto.getRua().trim());
        entity.setNumCasa(clienteDto.getNumCasa().trim());
        entity.setBairro(clienteDto.getBairro().trim());
        entity.setCep(clienteDto.getCep().trim());

        try {
            ClienteEntity salvo = repository.save(entity);

            Cliente clienteRetorno = new Cliente();
            clienteRetorno.setId(salvo.getId().longValue());
            clienteRetorno.setNome(salvo.getNome());
            clienteRetorno.setTelefones(
                List.of(salvo.getTelefone())
            );
            clienteRetorno.setRua(salvo.getRua());
            clienteRetorno.setNumCasa(salvo.getNumCasa());
            clienteRetorno.setBairro(salvo.getBairro());
            clienteRetorno.setCep(salvo.getCep());

            return clienteRetorno;

        } catch (DataIntegrityViolationException e) {
            throw ApiException.duplicado(
                "Não foi possível cadastrar o cliente. "
                + "Verifique se o telefone já está cadastrado "
                + "e se os dados informados são válidos."
            );
        }
    }
}
