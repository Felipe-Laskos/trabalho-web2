package com.web.equipe5.manutencaoequipamentos.service;

import com.web.equipe5.manutencaoequipamentos.model.Solicitacao;
import com.web.equipe5.manutencaoequipamentos.enums.EstadoSolicitacao;
import com.web.equipe5.manutencaoequipamentos.repository.SolicitacaoRepository;
import com.web.equipe5.manutencaoequipamentos.exception.BusinessRuleException;
import com.web.equipe5.manutencaoequipamentos.exception.ResourceNotFoundException;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SolicitacaoService {
    private final SolicitacaoRepository repository;

    public SolicitacaoService(SolicitacaoRepository repository) {
        this.repository = repository;
    }

    public Solicitacao aprovar(Long id) {
        Solicitacao s = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitação não encontrada"));

        if (s.getEstadoAtual() != EstadoSolicitacao.ORCADA) {
            throw new BusinessRuleException("Só é possível aprovar solicitações ORÇADAS");
        }

        s.setEstadoAtual(EstadoSolicitacao.APROVADA);
        //TODO Chamar e utilizar o historicoService aqui para registrar a transição, assim que ele for implementado.

        return repository.save(s);
    }

    public Solicitacao rejeitar(Long id, String motivoRejeicao) {
        if(motivoRejeicao == null || motivoRejeicao.isBlank()) {
            throw new BusinessRuleException("É obrigatório informar o motivo da rejeição!");
        }

        Solicitacao s = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitação não encontrada"));

        if (s.getEstadoAtual() != EstadoSolicitacao.ORCADA) {
            throw new BusinessRuleException("Só é possível rejeitar solicitações ORÇADAS");
        }

        s.setEstadoAtual(EstadoSolicitacao.REJEITADA);
        s.setMotivoRejeicao(motivoRejeicao);

        //TODO Chamar e utilizar o historicoService aqui para registrar a transição, assim que ele for implementado.
        return repository.save(s);
    }

    public Solicitacao resgatar(Long id) {
        Solicitacao s = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitação não encontrada"));

        if (s.getEstadoAtual() != EstadoSolicitacao.REJEITADA) {
            throw new BusinessRuleException("Só é possível resgatar solicitações REJEITADAS");
        }

        s.setEstadoAtual(EstadoSolicitacao.APROVADA);

        //TODO Chamar e utilizar o historicoService aqui para registrar a transição, assim que ele for implementado.
        return repository.save(s);
    }

    public Solicitacao pagar(Long id) {
        Solicitacao s = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitação não encontrada"));

        if (s.getEstadoAtual() != EstadoSolicitacao.ARRUMADA) {
            throw new BusinessRuleException("Só é possível pagar solicitações ARRUMADAS");
        }

        s.setEstadoAtual(EstadoSolicitacao.PAGA);
        s.setDataHoraPagamento(LocalDateTime.now());

        //TODO Chamar e utilizar o historicoService aqui para registrar a transição, assim que ele for implementado.
        return repository.save(s);
    }

    public List<Solicitacao> listarPorCliente(Long clienteId) {
        return repository.findByClienteId(clienteId);
    }

    public List<Solicitacao> listarPorEstado(EstadoSolicitacao estado) {
        return repository.findByEstadoAtual(estado);
    }

}
