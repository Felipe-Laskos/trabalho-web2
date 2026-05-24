package com.web.equipe5.manutencaoequipamentos.state;

import com.web.equipe5.manutencaoequipamentos.enums.EstadoSolicitacao;

public class EstadoFinalizada implements EstadoSolicitacaoState {
    @Override
    public EstadoSolicitacao getEstado() {
        return EstadoSolicitacao.FINALIZADA;
    }

    @Override
    public boolean podeTransicionarPara(EstadoSolicitacao novoEstado) {
        return false;
    }
}
