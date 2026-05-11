package com.web.equipe5.manutencaoequipamentos.repository;

import com.web.equipe5.manutencaoequipamentos.model.Solicitacao;
import com.web.equipe5.manutencaoequipamentos.enums.EstadoSolicitacao;
import com.web.equipe5.manutencaoequipamentos.dto.ReceitaPorDiaProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {

    List<Solicitacao> findByClienteId(Long clienteId);

    List<Solicitacao> findByEstadoAtual(EstadoSolicitacao estadoAtual);

    @Query(value = "SELECT CAST(s.data_hora_pagamento AS DATE) as data, SUM(s.valor_orcado) as total " +
                   "FROM tb_solicitacao s " +
                   "WHERE s.estado_atual IN ('PAGA', 'FINALIZADA') " +
                   "AND s.data_hora_pagamento >= :inicio AND s.data_hora_pagamento <= :fim " +
                   "GROUP BY CAST(s.data_hora_pagamento AS DATE) " +
                   "ORDER BY data ASC", nativeQuery = true)
    List<ReceitaPorDiaProjection> findReceitasAgrupadasPorDia(
            @Param("inicio") LocalDateTime inicio, 
            @Param("fim") LocalDateTime fim);

    //Endpoint de Filtros adicionando paginação
    Page<Solicitacao> findByDataHoraCriacaoBetween(LocalDateTime inicio, LocalDateTime fim, Pageable pageable);
}