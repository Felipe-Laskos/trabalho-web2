package com.web.equipe5.manutencaoequipamentos.mapper;

import com.web.equipe5.manutencaoequipamentos.model.HistoricoSolicitacao;
import com.web.equipe5.manutencaoequipamentos.dto.response.HistoricoSolicitacaoResponseDTO;

public class HistoricoSolicitacaoMapper {

    public static HistoricoSolicitacaoResponseDTO toDTO(HistoricoSolicitacao h) {
        return new HistoricoSolicitacaoResponseDTO(
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
