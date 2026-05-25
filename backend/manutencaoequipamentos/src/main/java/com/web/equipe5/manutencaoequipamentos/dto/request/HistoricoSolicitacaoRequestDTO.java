package com.web.equipe5.manutencaoequipamentos.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record HistoricoSolicitacaoRequestDTO(
    @NotNull(message = "O ID da solicitação é obrigatório.")
    Long solicitacaoId,

    @NotBlank(message = "O estado final da solicitação é obrigatório.")
    String estadoFinal,

    String motivoRegra
) {}
