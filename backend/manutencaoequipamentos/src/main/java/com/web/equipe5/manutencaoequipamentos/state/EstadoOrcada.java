package com.web.equipe5.manutencaoequipamentos.state;

import com.web.equipe5.manutencaoequipamentos.enums.EstadoSolicitacao;

public class EstadoOrcada implements EstadoSolicitacaoState {
    @Override
    public EstadoSolicitacao getEstado() {
        return EstadoSolicitacao.ORCADA;
    }

    @Override
    public boolean podeTransicionarPara(EstadoSolicitacao novoEstado) {
        return novoEstado == EstadoSolicitacao.APROVADA
                || novoEstado == EstadoSolicitacao.REJEITADA;
    }
}
