package com.web.equipe5.manutencaoequipamentos.service;

import com.web.equipe5.manutencaoequipamentos.model.Funcionario;
import com.web.equipe5.manutencaoequipamentos.model.Solicitacao;
import com.web.equipe5.manutencaoequipamentos.enums.EstadoSolicitacao;
import com.web.equipe5.manutencaoequipamentos.repository.SolicitacaoRepository;
import com.web.equipe5.manutencaoequipamentos.repository.FuncionarioRepository;
import com.web.equipe5.manutencaoequipamentos.config.JwtAuthenticationFilter.AuthenticatedPrincipal;
import com.web.equipe5.manutencaoequipamentos.exception.BusinessRuleException;
import com.web.equipe5.manutencaoequipamentos.exception.ResourceNotFoundException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;


@Service
public class SolicitacaoService {
    private final SolicitacaoRepository repository;
    private final FuncionarioRepository funcionarioRepository;

    public SolicitacaoService(SolicitacaoRepository repository, FuncionarioRepository funcionarioRepository) {
        this.repository = repository;
        this.funcionarioRepository = funcionarioRepository;
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

    public Solicitacao buscarPorId(Long id) { //ADICIONEI
    return repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Solicitação " + id + " não encontrada"));
    }

    public Solicitacao buscarPorIdECliente(Long id, AuthenticatedPrincipal principal) { 
    Solicitacao solicitacao = repository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Solicitação não encontrada"));

    if (principal.perfil().toUpperCase().contains("CLIENTE")) {
        if (!solicitacao.getCliente().getId().equals(principal.id())) {
            throw new AccessDeniedException("Você não tem permissão para visualizar esta solicitação.");
        }
    }
    return solicitacao;
   }

    public Solicitacao redirecionar(Long idSolicitacao, Long idFuncionarioLogado, Long idFuncionarioDestino) {
        Solicitacao s = repository.findById(idSolicitacao)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitação não encontrada"));

        // Validação para redirecionar somente é liberado para status APROVADA ou REDIRECIONADA
        if (s.getEstadoAtual() != EstadoSolicitacao.APROVADA && s.getEstadoAtual() != EstadoSolicitacao.REDIRECIONADA) {
            throw new BusinessRuleException("O redirecionamento só é permitido para solicitações nos estados APROVADA ou REDIRECIONADA.");
        }

        if (idFuncionarioLogado.equals(idFuncionarioDestino)) {
            throw new BusinessRuleException("Você não pode redirecionar a manutenção para si mesmo.");
        }

        Funcionario novoFuncionario = funcionarioRepository.findById(idFuncionarioDestino)
                .orElseThrow(() -> new ResourceNotFoundException("Funcionário de destino não encontrado."));

        s.setFuncionarioResponsavel(novoFuncionario);
        s.setEstadoAtual(EstadoSolicitacao.REDIRECIONADA);

        //TODO Chamar e utilizar o historicoService aqui para registrar a transição, assim que ele for implementado.
        return repository.save(s);
    }

    public Solicitacao efetuarManutencao(Long id) {
        Solicitacao s = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitação não encontrada"));

        // Regra do Roadmap: quando vem de REDIRECIONADA
        if (s.getEstadoAtual() != EstadoSolicitacao.REDIRECIONADA) {
            throw new BusinessRuleException("Só é possível efetuar manutenção II em solicitações REDIRECIONADAS");
        }

        s.setEstadoAtual(EstadoSolicitacao.ARRUMADA);

        //TODO Chamar e utilizar o historicoService aqui para registrar a transição
        return repository.save(s);
    }

}
