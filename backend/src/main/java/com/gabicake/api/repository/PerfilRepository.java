package com.gabicake.api.repository;

import com.gabicake.api.entity.PerfilEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PerfilRepository extends JpaRepository<PerfilEntity, Integer> {

    Optional<PerfilEntity> findByNome(String nome);
}