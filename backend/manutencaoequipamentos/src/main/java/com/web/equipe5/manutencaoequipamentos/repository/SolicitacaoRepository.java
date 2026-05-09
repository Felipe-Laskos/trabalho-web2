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

public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {

    List<Solicitacao> findByClienteId(Long clienteId);

    List<Solicitacao> findByEstadoAtual(EstadoSolicitacao estadoAtual);

    List<Solicitacao> findAllByOrderByDataHoraCriacaoAsc();

    @Query(value = "SELECT CAST(s.data_hora_pagamento AS DATE) as data, SUM(s.valor_orcado) as total " +
                   "FROM solicitacoes s " +
                   "WHERE s.estado_atual IN ('PAGA', 'FINALIZADA') " +
                   "AND s.data_hora_pagamento >= :inicio AND s.data_hora_pagamento <= :fim " +
                   "GROUP BY CAST(s.data_hora_pagamento AS DATE) " +
                   "ORDER BY data ASC", nativeQuery = true)
    List<ReceitaPorDiaProjection> findReceitasAgrupadasPorDia(
            @Param("inicio") LocalDateTime inicio,
            @Param("fim") LocalDateTime fim);
    
    @Query(value = "SELECT c.nome as nome, SUM(s.valor_orcado) as total " +
                   "FROM solicitacoes s " +
                   "JOIN categorias c ON s.categoria_id = c.id " +
                   "WHERE s.estado_atual IN ('PAGA', 'FINALIZADA') " +
                   "GROUP BY c.nome", nativeQuery = true)
    List<ReceitaPorCategoriaProjection> findReceitasAgrupadasPorCategoria();
}