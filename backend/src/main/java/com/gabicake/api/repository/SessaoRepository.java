package com.gabicake.api.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.gabicake.api.entity.SessaoEntity;

public interface SessaoRepository extends JpaRepository<SessaoEntity, Integer> {

    @EntityGraph(attributePaths = {"usuario", "usuario.perfis"})
    @Query("""
        select s from SessaoEntity s
        where s.tokenHash = :hash
          and s.revogadaEm is null
          and s.expiraEm > :agora
          and s.ultimoAcessoEm > :limiteInatividade
          and s.usuario.ativo = true
        """)
    Optional<SessaoEntity> buscarValida(
            @Param("hash") String hash,
            @Param("agora") LocalDateTime agora,
            @Param("limiteInatividade") LocalDateTime limiteInatividade
    );

    Optional<SessaoEntity> findByTokenHash(String tokenHash);
}
