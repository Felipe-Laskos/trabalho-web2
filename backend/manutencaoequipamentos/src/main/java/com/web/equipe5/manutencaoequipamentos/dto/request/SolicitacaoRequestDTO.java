package com.web.equipe5.manutencaoequipamentos.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record SolicitacaoRequestDTO(

    @NotBlank(message = "A descrição do equipamento é obrigatória.")
    @Size(min = 3, max = 200, message = "A descrição do equipamento deve ter entre 3 e 200 caracteres.")
    String descricaoEquipamento,

    @NotBlank(message = "A descrição do defeito é obrigatória.")
    @Size(min = 20, max = 200, message = "Detalhe um pouco mais o defeito (mínimo de 20 caracteres).")
    String descricaoDefeito,

    @NotNull(message = "O cliente é obrigatório.")
    Long clienteId,
    
    @NotNull(message = "A categoria é obrigatória.")
    Long categoriaId
) {}