package com.web.equipe5.manutencaoequipamentos.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import com.web.equipe5.manutencaoequipamentos.model.Solicitacao;

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
) {
    public SolicitacaoResponseDTO(Solicitacao s) {
        this(
            s.getId(),
            s.getDescricaoEquipamento(),
            s.getDescricaoDefeito(),
            s.getEstadoAtual() != null ? s.getEstadoAtual().name() : null, 
            s.getValorOrcado(),
            s.getFuncionarioOrcamento(), 
            s.getDataHoraOrcamento(),
            s.getMotivoRejeicao(),
            s.getDescricaoManutencao(),
            s.getOrientacoesCliente(),
            s.getDataHoraCriacao(),
            s.getDataHoraPagamento(),
            s.getDataHoraFinalizacao(),
            s.getAtivo(),
            s.getCliente() != null ? new ClienteResponseDTO(s.getCliente()) : null,
            s.getCategoriaEquipamento() != null ? new CategoriaEquipamentoResponseDTO(s.getCategoriaEquipamento()) : null,
            s.getFuncionarioResponsavel() != null ? new FuncionarioResponseDTO(s.getFuncionarioResponsavel()) : null,
            s.getHistorico() != null ? s.getHistorico().stream()
                .map(HistoricoSolicitacaoResponseDTO::new)
                .collect(java.util.stream.Collectors.toList()) : null
        );
    }
}