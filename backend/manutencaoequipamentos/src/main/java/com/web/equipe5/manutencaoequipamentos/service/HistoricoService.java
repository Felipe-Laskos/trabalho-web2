package com.web.equipe5.manutencaoequipamentos.service;
import com.web.equipe5.manutencaoequipamentos.repository.HistoricoRepository;
import com.web.equipe5.manutencaoequipamentos.model.Solicitacao;
import com.web.equipe5.manutencaoequipamentos.enums.EstadoSolicitacao;
import com.web.equipe5.manutencaoequipamentos.model.HistoricoSolicitacao;
import com.web.equipe5.manutencaoequipamentos.model.Funcionario;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class HistoricoService {

    private final HistoricoRepository repository;

    public HistoricoService(HistoricoRepository repository) {
        this.repository = repository;
    }

    public void registrar(
            Solicitacao solicitacao,
            EstadoSolicitacao estadoAnterior,
            EstadoSolicitacao estadoNovo,
            Funcionario funcionario
    ) {
        registrar(solicitacao, estadoAnterior, estadoNovo, funcionario, null, null);
    }

    public void registrar(
            Solicitacao solicitacao,
            EstadoSolicitacao estadoAnterior,
            EstadoSolicitacao estadoNovo,
            Funcionario funcionario,
            Funcionario funcionarioDestino,
            String observacao
    ) {
        HistoricoSolicitacao h = new HistoricoSolicitacao();

        h.setSolicitacao(solicitacao);
        h.setEstadoAnterior(estadoAnterior);
        h.setEstadoNovo(estadoNovo);
        h.setDataHora(LocalDateTime.now());
        h.setFuncionario(funcionario);
        h.setFuncionarioDestino(funcionarioDestino);
        h.setObservacao(observacao != null ? observacao : observacaoPadrao(estadoAnterior, estadoNovo));

        repository.save(h);
    }

    private String observacaoPadrao(EstadoSolicitacao estadoAnterior, EstadoSolicitacao estadoNovo) {
        if (estadoAnterior == null && estadoNovo == EstadoSolicitacao.ABERTA) {
            return "Solicitação aberta pelo cliente.";
        }

        return switch (estadoNovo) {
            case ORCADA -> "Orçamento registrado.";
            case REJEITADA -> "Orçamento rejeitado pelo cliente.";
            case APROVADA -> estadoAnterior == EstadoSolicitacao.REJEITADA
                    ? "Solicitação resgatada pelo cliente."
                    : "Orçamento aprovado pelo cliente.";
            case REDIRECIONADA -> "Solicitação redirecionada para outro funcionário.";
            case ARRUMADA -> "Manutenção concluída.";
            case PAGA -> "Pagamento registrado.";
            case FINALIZADA -> "Solicitação finalizada.";
            case ABERTA -> "Solicitação aberta pelo cliente.";
        };
    }

    public Page<HistoricoSolicitacao> listarPorSolicitacao(Long id, Pageable pageable) {
        return repository.findBySolicitacaoIdOrderByDataHoraAsc(id, pageable);
    }
}
