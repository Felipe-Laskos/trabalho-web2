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
    private final HistoricoService historicoService;

    public SolicitacaoService(SolicitacaoRepository repository, FuncionarioRepository funcionarioRepository, HistoricoService historicoService) {
        this.repository = repository;
        this.funcionarioRepository = funcionarioRepository;
        this.historicoService = historicoService;
    }

    public Solicitacao aprovar(Long id) {
        Solicitacao s = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitação não encontrada"));

        if (s.getEstadoAtual() != EstadoSolicitacao.ORCADA) {
            throw new BusinessRuleException("Só é possível aprovar solicitações ORÇADAS");
        }
        
        EstadoSolicitacao anterior = s.getEstadoAtual();

        s.setEstadoAtual(EstadoSolicitacao.APROVADA);
        historicoService.registrar(
            s,
            anterior,
            EstadoSolicitacao.APROVADA,
            null
        );
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

        EstadoSolicitacao anterior = s.getEstadoAtual();

        s.setEstadoAtual(EstadoSolicitacao.REJEITADA);
        s.setMotivoRejeicao(motivoRejeicao);

        historicoService.registrar(
            s,
            anterior,
            EstadoSolicitacao.REJEITADA,
            null
        );

        return repository.save(s);
    }

    public Solicitacao resgatar(Long id) {
        Solicitacao s = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitação não encontrada"));

        if (s.getEstadoAtual() != EstadoSolicitacao.REJEITADA) {
            throw new BusinessRuleException("Só é possível resgatar solicitações REJEITADAS");
        }

        EstadoSolicitacao anterior = s.getEstadoAtual();

        s.setEstadoAtual(EstadoSolicitacao.APROVADA);

        historicoService.registrar(
            s,
            anterior,
            EstadoSolicitacao.APROVADA,
            null
        );

        return repository.save(s);
    }

    public Solicitacao pagar(Long id) {
        Solicitacao s = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitação não encontrada"));

        if (s.getEstadoAtual() != EstadoSolicitacao.ARRUMADA) {
            throw new BusinessRuleException("Só é possível pagar solicitações ARRUMADAS");
        }

        EstadoSolicitacao anterior = s.getEstadoAtual();
        
        s.setEstadoAtual(EstadoSolicitacao.PAGA);
        s.setDataHoraPagamento(LocalDateTime.now());

        historicoService.registrar(
            s,
            anterior,
            EstadoSolicitacao.PAGA,
            null
        );

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

        EstadoSolicitacao anterior = s.getEstadoAtual();

        s.setFuncionarioResponsavel(novoFuncionario);
        s.setEstadoAtual(EstadoSolicitacao.REDIRECIONADA);

        historicoService.registrar(
            s,
            anterior,
            EstadoSolicitacao.REDIRECIONADA,
            novoFuncionario
        );

        return repository.save(s);
    }

    public Solicitacao efetuarManutencao(Long id) {
        Solicitacao s = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitação não encontrada"));

        // Regra do Roadmap: quando vem de REDIRECIONADA
        if (s.getEstadoAtual() != EstadoSolicitacao.REDIRECIONADA) {
            throw new BusinessRuleException("Só é possível efetuar manutenção II em solicitações REDIRECIONADAS");
        }

        EstadoSolicitacao anterior = s.getEstadoAtual();

        s.setEstadoAtual(EstadoSolicitacao.ARRUMADA);

        historicoService.registrar(
            s,
            anterior,
            EstadoSolicitacao.ARRUMADA,
            null
        );
        
        return repository.save(s);
    }

}
