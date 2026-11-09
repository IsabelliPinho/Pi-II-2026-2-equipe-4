package com.gabicake.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.gabicake.api.entity.UsuarioEntity;

import jakarta.persistence.LockModeType;

public interface UsuarioRepository extends JpaRepository<UsuarioEntity, Integer> {

    @EntityGraph(attributePaths = "perfis")
    Optional<UsuarioEntity> findByLogin(String login);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select u from UsuarioEntity u where u.login = :login")
    Optional<UsuarioEntity> buscarParaAutenticacao(
            @Param("login") String login
    );

    boolean existsByLogin(String login);
}