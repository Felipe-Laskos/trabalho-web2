package com.web.equipe5.manutencaoequipamentos.state;

import com.web.equipe5.manutencaoequipamentos.enums.EstadoSolicitacao;

public class EstadoAberta implements EstadoSolicitacaoState {
    @Override
    public EstadoSolicitacao getEstado() {
        return EstadoSolicitacao.ABERTA;
    }

    @Override
    public boolean podeTransicionarPara(EstadoSolicitacao novoEstado) {
        return novoEstado == EstadoSolicitacao.ORCADA;
    }
}
