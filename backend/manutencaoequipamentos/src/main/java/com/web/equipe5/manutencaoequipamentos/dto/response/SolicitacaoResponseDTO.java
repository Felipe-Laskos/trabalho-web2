package com.web.equipe5.manutencaoequipamentos.dto.response;

public record SolicitacaoResponseDTO(
    Long id,
    String descricaoEquipamento,
    String descricaoDefeito,
    String estadoAtual,
    Double valorOrcado,
    String clienteNome
) {}