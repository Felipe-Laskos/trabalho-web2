package com.web.equipe5.manutencaoequipamentos.dto;

import jakarta.validation.constraints.NotNull;

public record RedirecionarRequestDTO(
        @NotNull(message = "O ID do funcionário de destino é obrigatório.")
        Long idFuncionarioDestino
) {}