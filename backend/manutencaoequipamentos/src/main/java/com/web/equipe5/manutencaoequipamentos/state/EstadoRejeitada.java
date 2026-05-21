package com.web.equipe5.manutencaoequipamentos.state;

import com.web.equipe5.manutencaoequipamentos.enums.EstadoSolicitacao;

public class EstadoRejeitada implements EstadoSolicitacaoState {
    @Override
    public EstadoSolicitacao getEstado() {
        return EstadoSolicitacao.REJEITADA;
    }

    @Override
    public boolean podeTransicionarPara(EstadoSolicitacao novoEstado) {
        return novoEstado == EstadoSolicitacao.APROVADA;
    }
}
