package com.web.equipe5.manutencaoequipamentos.state;

import com.web.equipe5.manutencaoequipamentos.enums.EstadoSolicitacao;

public final class EstadoSolicitacaoFactory {
    private EstadoSolicitacaoFactory() {
    }

    public static EstadoSolicitacaoState criar(EstadoSolicitacao estado) {
        return switch (estado) {
            case ABERTA -> new EstadoAberta();
            case ORCADA -> new EstadoOrcada();
            case APROVADA -> new EstadoAprovada();
            case REJEITADA -> new EstadoRejeitada();
            case REDIRECIONADA -> new EstadoRedirecionada();
            case ARRUMADA -> new EstadoArrumada();
            case PAGA -> new EstadoPaga();
            case FINALIZADA -> new EstadoFinalizada();
        };
    }
}
