package com.web.equipe5.manutencaoequipamentos.state;

import com.web.equipe5.manutencaoequipamentos.enums.EstadoSolicitacao;

public class EstadoRedirecionada implements EstadoSolicitacaoState {
    @Override
    public EstadoSolicitacao getEstado() {
        return EstadoSolicitacao.REDIRECIONADA;
    }

    @Override
    public boolean podeTransicionarPara(EstadoSolicitacao novoEstado) {
        return novoEstado == EstadoSolicitacao.REDIRECIONADA
                || novoEstado == EstadoSolicitacao.ARRUMADA;
    }
}
