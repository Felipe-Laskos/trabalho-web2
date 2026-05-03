package com.web.equipe5.manutencaoequipamentos.dto.request;

import jakarta.validation.constraints.NotNull;

public record RedirecionarRequestDTO(
        @NotNull(message = "O Id do funcionário de destino é obrigatório.")
        Long idFuncionarioDestino
) {}