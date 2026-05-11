package com.web.equipe5.manutencaoequipamentos.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CategoriaEquipamentoUpdateRequestDTO(
    @NotBlank(message = "O nome da categoria é obrigatória.")
    String nome,

    Boolean ativo
) {}
