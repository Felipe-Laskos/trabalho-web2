package com.web.equipe5.manutencaoequipamentos.service;
import com.web.equipe5.manutencaoequipamentos.repository.HistoricoRepository;
import com.web.equipe5.manutencaoequipamentos.model.Solicitacao;
import com.web.equipe5.manutencaoequipamentos.enums.EstadoSolicitacao;
import com.web.equipe5.manutencaoequipamentos.model.HistoricoSolicitacao;
import com.web.equipe5.manutencaoequipamentos.model.Funcionario;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

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
        HistoricoSolicitacao h = new HistoricoSolicitacao();

        h.setSolicitacao(solicitacao);
        h.setEstadoAnterior(estadoAnterior);
        h.setEstadoNovo(estadoNovo);
        h.setDataHora(LocalDateTime.now());
        h.setFuncionario(funcionario); 

        repository.save(h);
    }

    public List<HistoricoSolicitacao> listarPorSolicitacao(Long id) {
        return repository.findBySolicitacaoIdOrderByDataHoraAsc(id);
    }
}