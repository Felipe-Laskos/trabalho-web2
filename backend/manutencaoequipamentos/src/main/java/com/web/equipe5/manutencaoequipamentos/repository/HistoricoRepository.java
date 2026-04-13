package com.web.equipe5.manutencaoequipamentos.repository;

import com.web.equipe5.manutencaoequipamentos.model.HistoricoSolicitacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistoricoRepository extends JpaRepository<HistoricoSolicitacao, Long> {

    List<HistoricoSolicitacao> findBySolicitacaoIdOrderByDataHoraAsc(Long solicitacaoId);
}