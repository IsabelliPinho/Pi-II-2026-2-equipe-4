package com.gabicake.api.repository;

import com.gabicake.api.entity.ClienteEntity;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClienteRepository extends JpaRepository<ClienteEntity, Integer> {

    // Busca por trecho do nome ou do telefone, sem diferenciar maiúsculas de minúsculas.
    List<ClienteEntity> findByNomeContainingIgnoreCaseOrTelefoneContainingIgnoreCase(
            String nome, String telefone, Sort sort);
}
