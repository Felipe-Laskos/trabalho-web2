package com.web.equipe5.manutencaoequipamentos.dto.request;

public record SolicitacaoRequestDTO(
    String descricaoEquipamento,
    String descricaoDefeito,
    Long clienteId,
    Long categoriaId
) {}