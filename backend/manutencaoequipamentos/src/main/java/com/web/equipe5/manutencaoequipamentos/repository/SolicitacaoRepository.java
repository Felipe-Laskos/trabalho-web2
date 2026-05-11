package com.web.equipe5.manutencaoequipamentos.repository;

import com.web.equipe5.manutencaoequipamentos.model.Solicitacao;

import com.web.equipe5.manutencaoequipamentos.enums.EstadoSolicitacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {

    List<Solicitacao> findByClienteId(Long clienteId);

    List<Solicitacao> findByEstadoAtual(EstadoSolicitacao estadoAtual);
}