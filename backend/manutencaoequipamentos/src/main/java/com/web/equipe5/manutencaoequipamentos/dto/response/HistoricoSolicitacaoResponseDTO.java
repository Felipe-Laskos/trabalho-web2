package com.web.equipe5.manutencaoequipamentos.dto.response;

import java.time.LocalDateTime;

public record HistoricoSolicitacaoResponseDTO(
    Long id,
    LocalDateTime dataHora,
    String estadoAnterior,
    String estadoNovo,
    String observacao,
    Long solicitacaoId,
    String funcionario,
    String funcionarioDestino
) {}
