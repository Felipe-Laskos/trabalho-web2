package com.web.equipe5.manutencaoequipamentos.dto.response;

import java.time.LocalDateTime;

import com.web.equipe5.manutencaoequipamentos.model.HistoricoSolicitacao;

public record HistoricoSolicitacaoResponseDTO(
    Long id,
    LocalDateTime dataHora,
    String estadoAnterior,
    String estadoNovo,
    String observacao,
    Long solicitacaoId,
    String funcionario,
    String funcionarioDestino
) {
    public HistoricoSolicitacaoResponseDTO(HistoricoSolicitacao h) {
        this(
            h.getId(),
            h.getDataHora(),
            h.getEstadoAnterior() != null ? h.getEstadoAnterior().name() : null, 
            h.getEstadoNovo() != null ? h.getEstadoNovo().name() : null,
            h.getObservacao(),
            h.getSolicitacao() != null ? h.getSolicitacao().getId() : null,
            h.getFuncionario() != null ? h.getFuncionario().getNome() : null,
            h.getFuncionarioDestino() != null ? h.getFuncionarioDestino().getNome() : null
        );
    }
}

