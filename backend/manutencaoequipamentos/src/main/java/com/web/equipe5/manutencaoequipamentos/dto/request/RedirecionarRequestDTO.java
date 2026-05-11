package com.web.equipe5.manutencaoequipamentos.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record RedirecionarRequestDTO(
        @NotNull(message = "O Id do funcionário de destino é obrigatório.")
        @Positive(message = "O Id do funcionário de destino deve ser maior que zero.")
        Long idFuncionarioDestino
) {}
