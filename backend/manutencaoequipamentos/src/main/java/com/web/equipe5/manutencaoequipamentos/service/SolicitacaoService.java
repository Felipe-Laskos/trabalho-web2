package com.web.equipe5.manutencaoequipamentos.service;

import com.web.equipe5.manutencaoequipamentos.model.Funcionario;
import com.web.equipe5.manutencaoequipamentos.model.Solicitacao;
import com.web.equipe5.manutencaoequipamentos.model.Cliente;
import com.web.equipe5.manutencaoequipamentos.model.CategoriaEquipamento;
import com.web.equipe5.manutencaoequipamentos.dto.request.EfetuarManutencaoRequestDTO;
import com.web.equipe5.manutencaoequipamentos.dto.request.SolicitacaoCreateRequestDTO;
import com.web.equipe5.manutencaoequipamentos.enums.EstadoSolicitacao;
import com.web.equipe5.manutencaoequipamentos.repository.FuncionarioRepository;
import com.web.equipe5.manutencaoequipamentos.repository.SolicitacaoRepository;
import com.web.equipe5.manutencaoequipamentos.repository.ClienteRepository;
import com.web.equipe5.manutencaoequipamentos.repository.CategoriaRepository;
import com.web.equipe5.manutencaoequipamentos.config.JwtAuthenticationFilter.AuthenticatedPrincipal;
import com.web.equipe5.manutencaoequipamentos.exception.BusinessRuleException;
import com.web.equipe5.manutencaoequipamentos.exception.ResourceNotFoundException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


@Service
public class SolicitacaoService {
    private final SolicitacaoRepository repository;
    private final FuncionarioRepository funcionarioRepository;
    private final ClienteRepository clienteRepository;
    private final CategoriaRepository categoriaRepository;
    private final HistoricoService historicoService;

    public SolicitacaoService(
            SolicitacaoRepository repository,
            FuncionarioRepository funcionarioRepository,
            ClienteRepository clienteRepository,
            CategoriaRepository categoriaRepository,
            HistoricoService historicoService) {
        this.repository = repository;
        this.funcionarioRepository = funcionarioRepository;
        this.clienteRepository = clienteRepository;
        this.categoriaRepository = categoriaRepository;
        this.historicoService = historicoService;
    }

    public Solicitacao aprovar(Long id, AuthenticatedPrincipal principal) {
        Solicitacao s = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitação não encontrada"));

        exigirClienteDono(s, principal);

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

    public Solicitacao rejeitar(Long id, String motivoRejeicao, AuthenticatedPrincipal principal) {
        if(motivoRejeicao == null || motivoRejeicao.isBlank()) {
            throw new BusinessRuleException("É obrigatório informar o motivo da rejeição!");
        }

        Solicitacao s = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitação não encontrada"));

        exigirClienteDono(s, principal);

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

    public Solicitacao resgatar(Long id, AuthenticatedPrincipal principal) {
        Solicitacao s = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitação não encontrada"));

        exigirClienteDono(s, principal);

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

    public Solicitacao pagar(Long id, AuthenticatedPrincipal principal) {
        Solicitacao s = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitação não encontrada"));

        exigirClienteDono(s, principal);

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

    public Page<Solicitacao> listarPorCliente(Long clienteId, Pageable pageable, AuthenticatedPrincipal principal) {
        exigirClienteDono(clienteId, principal);
        return repository.findByClienteId(clienteId, pageable);
    }

    public Page<Solicitacao> listarPorEstado(EstadoSolicitacao estado, Pageable pageable, AuthenticatedPrincipal principal) {
        exigirFuncionario(principal);
        return repository.findByEstadoAtual(estado, pageable);
    }

    public Page<Solicitacao> listarTodos(Pageable pageable, AuthenticatedPrincipal principal) {
        exigirFuncionario(principal);
        return repository.findAllByOrderByDataHoraCriacaoAsc(pageable);
    }

    public Solicitacao buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitação " + id + " não encontrada"));
    }

    public Solicitacao buscarPorIdECliente(Long id, AuthenticatedPrincipal principal) {
        exigirAutenticado(principal);

        Solicitacao solicitacao = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitação não encontrada"));

        if (isCliente(principal)) {
            if (!solicitacao.getCliente().getId().equals(principal.id())) {
                throw new AccessDeniedException("Você não tem permissão para visualizar esta solicitação.");
            }
        }
        return solicitacao;
    }

    public Solicitacao redirecionar(Long idSolicitacao, AuthenticatedPrincipal principal, Long idFuncionarioDestino) {
        exigirFuncionario(principal);

        Solicitacao s = repository.findById(idSolicitacao)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitação não encontrada"));

        if (s.getEstadoAtual() != EstadoSolicitacao.APROVADA && s.getEstadoAtual() != EstadoSolicitacao.REDIRECIONADA) {
            throw new BusinessRuleException("O redirecionamento só é permitido para solicitações nos estados APROVADA ou REDIRECIONADA.");
        }

        if (principal.id().equals(idFuncionarioDestino)) {
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

    public Solicitacao criar(SolicitacaoCreateRequestDTO request, AuthenticatedPrincipal principal) {
        exigirCliente(principal);

        Cliente cliente = clienteRepository.findById(principal.id())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));

        CategoriaEquipamento categoria = categoriaRepository.findById(request.categoriaId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada"));

        Solicitacao solicitacao = new Solicitacao();
        solicitacao.setDescricaoEquipamento(request.descricaoEquipamento());
        solicitacao.setDescricaoDefeito(request.descricaoDefeito());
        solicitacao.setCliente(cliente);
        solicitacao.setCategoriaEquipamento(categoria);
        solicitacao.setEstadoAtual(EstadoSolicitacao.ABERTA);
        solicitacao.setDataHoraCriacao(LocalDateTime.now());
        solicitacao.setAtivo(true);

        Solicitacao solicitacaoSalva = repository.save(solicitacao);

        historicoService.registrar(
            solicitacaoSalva,
            null,
            EstadoSolicitacao.ABERTA,
            null
        );

        return solicitacaoSalva;
    }

    public Solicitacao orcar(Long id, Double valor, AuthenticatedPrincipal principal) {
        exigirFuncionario(principal);

        Solicitacao s = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitação não encontrada"));

        if (s.getEstadoAtual() != EstadoSolicitacao.ABERTA) {
            throw new BusinessRuleException("Só é possível orçar solicitações ABERTAS");
        }

        Funcionario funcionario = funcionarioRepository.findById(principal.id())
                .orElseThrow(() -> new ResourceNotFoundException("Funcionário não encontrado"));

        EstadoSolicitacao anterior = s.getEstadoAtual();

        s.setValorOrcado(valor);
        s.setFuncionarioResponsavel(funcionario);
        s.setFuncionarioOrcamento(funcionario.getNome());
        s.setEstadoAtual(EstadoSolicitacao.ORCADA);
        s.setDataHoraOrcamento(LocalDateTime.now());

        historicoService.registrar(
            s,
            anterior,
            EstadoSolicitacao.ORCADA,
            null
        );

        return repository.save(s);
    }

    public Solicitacao efetuarManutencao(Long id, EfetuarManutencaoRequestDTO dto, AuthenticatedPrincipal principal) {
        exigirFuncionario(principal);

        Solicitacao s = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitação não encontrada"));

        if (s.getEstadoAtual() != EstadoSolicitacao.APROVADA &&
            s.getEstadoAtual() != EstadoSolicitacao.REDIRECIONADA) {

            throw new BusinessRuleException(
                "Só é possível efetuar manutenção em solicitações APROVADAS ou REDIRECIONADAS"
            );
        }

        Funcionario funcionario = funcionarioRepository.findById(principal.id())
                .orElseThrow(() -> new ResourceNotFoundException("Funcionário não encontrado"));

        EstadoSolicitacao anterior = s.getEstadoAtual();

        s.setDescricaoManutencao(dto.descricaoManutencao());
        s.setOrientacoesCliente(dto.orientacoesCliente());
        s.setFuncionarioResponsavel(funcionario);
        s.setDataHoraManutencao(LocalDateTime.now());
        s.setEstadoAtual(EstadoSolicitacao.ARRUMADA);

        historicoService.registrar(
            s,
            anterior,
            EstadoSolicitacao.ARRUMADA,
            null
        );

        return repository.save(s);
    }

    public Solicitacao finalizar(Long id, AuthenticatedPrincipal principal) {
        exigirFuncionario(principal);

        Solicitacao s = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitação não encontrada"));

        Funcionario funcionario = funcionarioRepository.findById(principal.id())
                .orElseThrow(() -> new ResourceNotFoundException("Funcionário não encontrado"));

        EstadoSolicitacao anterior = s.getEstadoAtual();

        s.setFuncionarioResponsavel(funcionario);
        s.setEstadoAtual(EstadoSolicitacao.FINALIZADA);
        s.setDataHoraFinalizacao(LocalDateTime.now());

        historicoService.registrar(
            s,
            anterior,
            EstadoSolicitacao.FINALIZADA,
            null
        );

        return repository.save(s);
    }

    private void exigirAutenticado(AuthenticatedPrincipal principal) {
        if (principal == null) {
            throw new AccessDeniedException("Usuário não autenticado");
        }
    }

    private void exigirCliente(AuthenticatedPrincipal principal) {
        exigirAutenticado(principal);
        if (!isCliente(principal)) {
            throw new AccessDeniedException("Apenas clientes podem realizar esta operação.");
        }
    }

    private void exigirFuncionario(AuthenticatedPrincipal principal) {
        exigirAutenticado(principal);
        if (!isFuncionario(principal)) {
            throw new AccessDeniedException("Apenas funcionários podem realizar esta operação.");
        }
    }

    private void exigirClienteDono(Solicitacao solicitacao, AuthenticatedPrincipal principal) {
        exigirClienteDono(solicitacao.getCliente().getId(), principal);
    }

    private void exigirClienteDono(Long clienteId, AuthenticatedPrincipal principal) {
        exigirCliente(principal);
        if (!clienteId.equals(principal.id())) {
            throw new AccessDeniedException("Você não tem permissão para acessar solicitações de outro cliente.");
        }
    }

    private boolean isCliente(AuthenticatedPrincipal principal) {
        return "CLIENTE".equalsIgnoreCase(principal.perfil());
    }

    private boolean isFuncionario(AuthenticatedPrincipal principal) {
        return "FUNCIONARIO".equalsIgnoreCase(principal.perfil());
    }

}
