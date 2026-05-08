package com.web.equipe5.manutencaoequipamentos.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record OrcarRequestDTO(
    @NotNull(message = "O valor do orçamento é obrigatório.")
    @Positive(message = "O valor deve ser maior que zero.")
    Double valor
) {}