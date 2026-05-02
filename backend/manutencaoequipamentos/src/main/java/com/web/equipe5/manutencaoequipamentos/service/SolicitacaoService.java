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
import java.util.List;


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

    public List<Solicitacao> listarTodos() {
    return repository.findAll();
    }

    public Solicitacao buscarPorId(Long id) {
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

    public Solicitacao redirecionar(Long idSolicitacao, AuthenticatedPrincipal principal, Long idFuncionarioDestino) {
        if (!"FUNCIONARIO".equalsIgnoreCase(principal.perfil())) {
            throw new AccessDeniedException("Apenas funcionários podem redirecionar manutenções.");
        }

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

    public Solicitacao criar(SolicitacaoCreateRequestDTO request, Long clienteId) {
        Cliente cliente = clienteRepository.findById(clienteId)
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

        return repository.save(solicitacao);
    }

    public Solicitacao orcar(Long id, Double valor, Long funcionarioId) {
        Solicitacao s = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitação não encontrada"));

        if (s.getEstadoAtual() != EstadoSolicitacao.ABERTA) {
            throw new BusinessRuleException("Só é possível orçar solicitações ABERTAS");
        }

        Funcionario funcionario = funcionarioRepository.findById(funcionarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Funcionário não encontrado"));

        s.setValorOrcado(valor);
        s.setFuncionarioResponsavel(funcionario);
        s.setFuncionarioOrcamento(funcionario.getNome());
        s.setEstadoAtual(EstadoSolicitacao.ORCADA);
        s.setDataHoraOrcamento(LocalDateTime.now());

        return repository.save(s);
    }

    public Solicitacao efetuarManutencao(Long id, EfetuarManutencaoRequestDTO dto, Long funcionarioId) {
        Solicitacao s = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitação não encontrada"));

        if (s.getEstadoAtual() != EstadoSolicitacao.APROVADA &&
            s.getEstadoAtual() != EstadoSolicitacao.REDIRECIONADA) {

            throw new BusinessRuleException(
                "Só é possível efetuar manutenção em solicitações APROVADAS ou REDIRECIONADAS"
            );
        }

        Funcionario funcionario = funcionarioRepository.findById(funcionarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Funcionário não encontrado"));

        s.setDescricaoManutencao(dto.descricaoManutencao());
        s.setOrientacoesCliente(dto.orientacoesCliente());
        s.setFuncionarioResponsavel(funcionario);
        s.setDataHoraManutencao(LocalDateTime.now());
        s.setEstadoAtual(EstadoSolicitacao.ARRUMADA);

        return repository.save(s);
    }

    public Solicitacao finalizar(Long id, Long funcionarioId) {
        Solicitacao s = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitação não encontrada"));

        if (s.getEstadoAtual() != EstadoSolicitacao.PAGA) {
            throw new BusinessRuleException("Só é possível finalizar solicitações PAGAS");
        }

        s.setEstadoAtual(EstadoSolicitacao.FINALIZADA);
        s.setDataHoraFinalizacao(LocalDateTime.now());

        // TODO: Usar HistoricoService para registrar que o funcionário finalizou a solicitação

        return repository.save(s);
    }

}
