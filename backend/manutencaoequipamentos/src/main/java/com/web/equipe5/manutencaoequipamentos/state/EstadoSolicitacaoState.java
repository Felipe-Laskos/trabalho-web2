package com.web.equipe5.manutencaoequipamentos.state;

import com.web.equipe5.manutencaoequipamentos.enums.EstadoSolicitacao;
import com.web.equipe5.manutencaoequipamentos.exception.BusinessRuleException;

public interface EstadoSolicitacaoState {
    EstadoSolicitacao getEstado();

    boolean podeTransicionarPara(EstadoSolicitacao novoEstado);

    default void validarTransicaoPara(EstadoSolicitacao novoEstado) {
        if (!podeTransicionarPara(novoEstado)) {
            throw new BusinessRuleException(
                    "Não é possível alterar solicitação de " + getEstado() + " para " + novoEstado
            );
        }
    }
}
