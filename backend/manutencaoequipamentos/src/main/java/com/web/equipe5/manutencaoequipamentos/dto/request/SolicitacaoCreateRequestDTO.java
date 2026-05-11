package com.web.equipe5.manutencaoequipamentos.dto.request;

public record SolicitacaoCreateRequestDTO(
    String descricaoEquipamento,
    String descricaoDefeito,
    Long categoriaId
) {}