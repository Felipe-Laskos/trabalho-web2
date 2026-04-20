package com.web.equipe5.manutencaoequipamentos.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public record SolicitacaoResponseDTO(
    Long id,
    String descricaoEquipamento,
    String descricaoDefeito,
    String estadoAtual,
    Double valorOrcado,
    String funcionarioOrcamento,
    LocalDateTime dataHoraOrcamento,
    String motivoRejeicao,
    String descricaoManutencao,
    String orientacoesCliente,
    LocalDateTime dataHoraCriacao,
    LocalDateTime dataHoraPagamento,
    LocalDateTime dataHoraFinalizacao,
    Boolean ativo,
    ClienteResponseDTO cliente,
    CategoriaEquipamentoResponseDTO categoria,
    FuncionarioResponseDTO funcionarioResponsavel,
    List<HistoricoSolicitacaoResponseDTO> historico
) {}