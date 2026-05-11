package com.web.equipe5.manutencaoequipamentos.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;


public record CategoriaEquipamentoRequestDTO(
    @NotBlank(message = "O nome da categoria é obrigatória.")
    String nome,

    @NotNull(message = "O campo 'ativo' é obrigatório.")   
    Boolean ativo
) {}