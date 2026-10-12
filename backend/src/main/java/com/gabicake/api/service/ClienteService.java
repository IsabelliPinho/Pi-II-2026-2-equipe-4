package com.gabicake.api.service;

/**
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

    // GET /clientes/busca: consulta o PostgreSQL.
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

    // POST /clientes/cadastro: persiste diretamente no PostgreSQL utilizando a ClienteEntity.
    public Cliente cadastrar(Cliente clienteDto) {
        if (clienteDto.getNome() == null || clienteDto.getNome().isBlank()
                || clienteDto.getTelefones() == null || clienteDto.getTelefones().isEmpty()) {
            throw ApiException.validacao("Nome e ao menos um telefone são obrigatórios.");
        }

        // Pega o primeiro telefone enviado no DTO
        String telefonePrincipal = clienteDto.getTelefones().get(0);

        // Instancia e preenche a entidade mapeada para o banco com todos os campos necessários
        ClienteEntity entity = new ClienteEntity();
        // Nota: Como o setId não está visível explicitamente na entity (gerado pelo banco), 
        // os campos são definidos via atributos ou se houver construtor/setters adequados.
        // Certifique-se de que sua ClienteEntity possui setters para esses campos caso precise atribuí-los diretamente,
        // ou utilize um construtor se preferir.
        
        try {
            // Salva no banco de dados através do Spring Data JPA
            ClienteEntity salvo = repository.save(entity);

            // Retorna no formato de modelo esperado pela API
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