package com.web.equipe5.manutencaoequipamentos.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record EfetuarManutencaoRequestDTO(
    @NotBlank(message = "A descrição da manutenção é obrigatória.")
    @Size(min = 3, max = 200, message = "A descrição da manutenção deve ter entre 3 e 200 caracteres.")
    String descricaoManutencao,

    @NotBlank(message = "É obrigatório fornecer orientações para o cliente.")
    @Size(min = 3, max = 200, message = "A orientação deve ter entre 3 e 200 caracteres.")
    String orientacoesCliente
) {}