package com.gabicake.api.repository;

import com.gabicake.api.entity.UsuarioEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<UsuarioEntity, Integer> {

    // Já traz os perfis junto, porque o login precisa deles na resposta.
    @EntityGraph(attributePaths = "perfis")
    Optional<UsuarioEntity> findByLogin(String login);

    boolean existsByLogin(String login);
}