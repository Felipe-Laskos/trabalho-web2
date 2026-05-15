package com.web.equipe5.manutencaoequipamentos.repository;

import com.web.equipe5.manutencaoequipamentos.dto.ReceitaPorDiaProjection;
import com.web.equipe5.manutencaoequipamentos.dto.ReceitaPorCategoriaProjection;
import com.web.equipe5.manutencaoequipamentos.enums.EstadoSolicitacao;
import com.web.equipe5.manutencaoequipamentos.model.Solicitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {

    Page<Solicitacao> findByClienteId(Long clienteId, Pageable pageable);

    Page<Solicitacao> findByEstadoAtual(EstadoSolicitacao estadoAtual, Pageable pageable);
    Page<Solicitacao> findAllByOrderByDataHoraCriacaoAsc(Pageable pageable);
    @Query(value = "SELECT CAST(s.data_hora_pagamento AS DATE) as data, SUM(s.valor_orcado) as total " +
                   "FROM solicitacoes s " +
                   "WHERE s.estado_atual IN ('PAGA', 'FINALIZADA') " +
                   "AND s.data_hora_pagamento >= :inicio AND s.data_hora_pagamento <= :fim " +
                   "GROUP BY CAST(s.data_hora_pagamento AS DATE) " +
                   "ORDER BY data ASC", nativeQuery = true)
    List<ReceitaPorDiaProjection> findReceitasAgrupadasPorDia(
            @Param("inicio") LocalDateTime inicio,
            @Param("fim") LocalDateTime fim);
    
    @Query(value = """
        SELECT
            c.nome as nome,
            SUM(s.valor_orcado) as total
        FROM solicitacoes s
        JOIN categorias c
            ON s.categoria_id = c.id
        WHERE s.estado_atual IN ('PAGA', 'FINALIZADA')
        GROUP BY c.nome
        """, nativeQuery = true)
    List<ReceitaPorCategoriaProjection>
    findReceitasAgrupadasPorCategoria();
    Page<Solicitacao> findByDataHoraCriacaoBetween(
        LocalDateTime inicio,
        LocalDateTime fim,
        Pageable pageable
);
}

