package com.web.equipe5.manutencaoequipamentos.mapper;
import com.web.equipe5.manutencaoequipamentos.dto.response.SolicitacaoResponseDTO;
import com.web.equipe5.manutencaoequipamentos.model.Solicitacao;

public class SolicitacaoMapper {

    public static SolicitacaoResponseDTO toDTO(Solicitacao s) {
        return new SolicitacaoResponseDTO(
            s.getId(),
            s.getDescricaoEquipamento(),
            s.getDescricaoDefeito(),
            s.getEstadoAtual().name(),
            s.getValorOrcado(),
            s.getCliente() != null ? s.getCliente().getNome() : null
        );
    }
}
