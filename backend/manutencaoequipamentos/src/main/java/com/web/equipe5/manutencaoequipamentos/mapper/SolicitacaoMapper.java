package com.web.equipe5.manutencaoequipamentos.mapper;

import java.time.LocalDateTime;

import com.web.equipe5.manutencaoequipamentos.dto.request.SolicitacaoRequestDTO;
import com.web.equipe5.manutencaoequipamentos.dto.response.SolicitacaoResponseDTO;
import com.web.equipe5.manutencaoequipamentos.enums.EstadoSolicitacao;
import com.web.equipe5.manutencaoequipamentos.model.CategoriaEquipamento;
import com.web.equipe5.manutencaoequipamentos.model.Cliente;
import com.web.equipe5.manutencaoequipamentos.model.Solicitacao;


public class SolicitacaoMapper {


    public static Solicitacao toEntity(
    SolicitacaoRequestDTO dto,
    Cliente cliente,
    CategoriaEquipamento categoria
) {
    Solicitacao s = new Solicitacao();

    s.setDescricaoEquipamento(dto.descricaoEquipamento());
    s.setDescricaoDefeito(dto.descricaoDefeito());

    s.setCliente(cliente);
    s.setCategoriaEquipamento(categoria);

    s.setEstadoAtual(EstadoSolicitacao.ABERTA);
    s.setDataHoraCriacao(LocalDateTime.now());
    s.setAtivo(true);

    return s;
}
    public static SolicitacaoResponseDTO toDTO(Solicitacao s) {
        return new SolicitacaoResponseDTO(
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

            s.getCliente() != null ? ClienteMapper.toDTO(s.getCliente()) : null,
            s.getCategoriaEquipamento() != null ? CategoriaEquipamentoMapper.toDTO(s.getCategoriaEquipamento()) : null,
            s.getFuncionarioResponsavel() != null ? FuncionarioMapper.toDTO(s.getFuncionarioResponsavel()) : null,

            s.getHistorico() != null
                ? s.getHistorico().stream()
                    .map(HistoricoSolicitacaoMapper::toDTO)
                    .toList()
                : null
        );
    }
}