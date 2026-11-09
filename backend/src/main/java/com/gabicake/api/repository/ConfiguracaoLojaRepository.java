package com.gabicake.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gabicake.api.entity.ConfiguracaoLojaEntity;

public interface ConfiguracaoLojaRepository
        extends JpaRepository<ConfiguracaoLojaEntity, Integer> {

    default Optional<ConfiguracaoLojaEntity> buscarConfiguracao() {
        return findById(1);
    }
}