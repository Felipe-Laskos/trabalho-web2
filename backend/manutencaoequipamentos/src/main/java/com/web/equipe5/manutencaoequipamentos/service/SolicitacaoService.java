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
import com.web.equipe5.manutencaoequipamentos.mapper.SolicitacaoMapper;
import com.web.equipe5.manutencaoequipamentos.state.EstadoSolicitacaoFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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

        validarTransicao(s, EstadoSolicitacao.APROVADA);

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

        validarTransicao(s, EstadoSolicitacao.REJEITADA);

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

        validarTransicao(s, EstadoSolicitacao.APROVADA);

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

        validarTransicao(s, EstadoSolicitacao.PAGA);

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

    public Page<Solicitacao> listarPorCliente(
            Long clienteId,
            String termo,
            Pageable pageable,
        AuthenticatedPrincipal principal) {
        exigirClienteDono(clienteId, principal);
        String termoNormalizado = normalizarTermo(termo);

        if (termoNormalizado.isEmpty()) {
            return repository.findByClienteId(clienteId, pageable);
        }

        return repository.findByClienteIdAndDescricaoEquipamentoContainingIgnoreCase(
                clienteId,
                termoNormalizado,
                pageable
        );
    }

    private String normalizarTermo(String termo) {
        return termo == null ? "" : termo.trim();
    }

    public Page<Solicitacao> listarPorEstado(EstadoSolicitacao estado, Pageable pageable, AuthenticatedPrincipal principal) {
        exigirFuncionario(principal);
        return repository.findByEstadoAtual(estado, pageable);
    }

    public Page<Solicitacao> listarTodos(
            EstadoSolicitacao estado,
            LocalDate dataInicio,
            LocalDate dataFim,
            Pageable pageable,
            AuthenticatedPrincipal principal
    ) {

        exigirFuncionario(principal);
        Long funcionarioId = principal.id();

        LocalDateTime inicio = null;
        LocalDateTime fim = null;

        if (dataInicio != null) {
            inicio = dataInicio.atStartOfDay();
        }

        if (dataFim != null) {
            fim = dataFim.atTime(23, 59, 59);
        }

        return repository.buscarComFiltros(
                estado,
                inicio,
                fim,
                funcionarioId,
                pageable
        );
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

        Funcionario funcionarioOrigem = funcionarioRepository.findById(principal.id())
                .orElseThrow(() -> new ResourceNotFoundException("Funcionário de origem não encontrado."));

        exigirFuncionarioResponsavelAtual(s, funcionarioOrigem);
        validarTransicao(s, EstadoSolicitacao.REDIRECIONADA);

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
            funcionarioOrigem,
            novoFuncionario,
            null
        );

        return repository.save(s);
    }

    public Solicitacao criar(SolicitacaoCreateRequestDTO request, AuthenticatedPrincipal principal) {
        exigirCliente(principal);

        Cliente cliente = clienteRepository.findById(principal.id())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));

        CategoriaEquipamento categoria = categoriaRepository.findById(request.categoriaId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada"));

        Solicitacao solicitacao = SolicitacaoMapper.toEntity(
            request,
            cliente,
            categoria
        );

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

        validarTransicao(s, EstadoSolicitacao.ORCADA);

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
            funcionario
        );

        return repository.save(s);
    }

    public Solicitacao efetuarManutencao(Long id, EfetuarManutencaoRequestDTO dto, AuthenticatedPrincipal principal) {
        exigirFuncionario(principal);

        Solicitacao s = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitação não encontrada"));

        Funcionario funcionario = funcionarioRepository.findById(principal.id())
                .orElseThrow(() -> new ResourceNotFoundException("Funcionário não encontrado"));

        exigirFuncionarioResponsavelAtual(s, funcionario);
        validarTransicao(s, EstadoSolicitacao.ARRUMADA);

        EstadoSolicitacao anterior = s.getEstadoAtual();

        s.setDescricaoManutencao(dto.descricaoManutencao());
        s.setOrientacoesCliente(dto.orientacoesCliente());
        s.setDataHoraManutencao(LocalDateTime.now());
        s.setEstadoAtual(EstadoSolicitacao.ARRUMADA);

        historicoService.registrar(
            s,
            anterior,
            EstadoSolicitacao.ARRUMADA,
            funcionario
        );

        return repository.save(s);
    }

    public Solicitacao finalizar(Long id, AuthenticatedPrincipal principal) {
        exigirFuncionario(principal);

        Solicitacao s = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitação não encontrada"));

        Funcionario funcionario = funcionarioRepository.findById(principal.id())
                .orElseThrow(() -> new ResourceNotFoundException("Funcionário não encontrado"));

        exigirFuncionarioResponsavelAtual(s, funcionario);
        validarTransicao(s, EstadoSolicitacao.FINALIZADA);

        EstadoSolicitacao anterior = s.getEstadoAtual();

        s.setEstadoAtual(EstadoSolicitacao.FINALIZADA);
        s.setDataHoraFinalizacao(LocalDateTime.now());

        historicoService.registrar(
            s,
            anterior,
            EstadoSolicitacao.FINALIZADA,
            funcionario
        );

        return repository.save(s);
    }

    public Page<Solicitacao> listarComFiltros(
            String filtro,
            String dataInicio,
            String dataFim,
            Pageable pageable,
            AuthenticatedPrincipal principal
    ) {

        exigirFuncionario(principal);
        Long funcionarioId = principal.id();

        switch (filtro.toUpperCase()) {
            case "HOJE":
                LocalDate hoje = LocalDate.now();
                return repository.buscarComFiltros(
                        null,
                        hoje.atStartOfDay(),
                        hoje.atTime(23, 59, 59),
                        funcionarioId,
                        pageable
                );

            case "PERIODO":
                if (dataInicio == null || dataFim == null) {
                    return Page.empty(pageable);
                }

                LocalDateTime inicio = LocalDate.parse(dataInicio).atStartOfDay();
                LocalDateTime fim = LocalDate.parse(dataFim).atTime(23, 59, 59);

                return repository.buscarComFiltros(
                        null,
                        inicio,
                        fim,
                        funcionarioId,
                        pageable
                );

            default:
                return repository.buscarComFiltros(
                        null,
                        null,
                        null,
                        funcionarioId,
                        pageable
                );
        }
    }
    private void exigirAutenticado(AuthenticatedPrincipal principal) {
        if (principal == null) {
            throw new AccessDeniedException("Usuário não autenticado");
        }
    }

    private void validarTransicao(Solicitacao solicitacao, EstadoSolicitacao novoEstado) {
        EstadoSolicitacaoFactory
                .criar(solicitacao.getEstadoAtual())
                .validarTransicaoPara(novoEstado);
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

    private void exigirFuncionarioResponsavelAtual(Solicitacao solicitacao, Funcionario funcionario) {
        if (solicitacao.getFuncionarioResponsavel() == null
                || !solicitacao.getFuncionarioResponsavel().getId().equals(funcionario.getId())) {
            throw new AccessDeniedException("Você não é o funcionário responsável por esta solicitação.");
        }
    }

    private boolean isCliente(AuthenticatedPrincipal principal) {
        return "CLIENTE".equalsIgnoreCase(principal.perfil());
    }

    private boolean isFuncionario(AuthenticatedPrincipal principal) {
        return "FUNCIONARIO".equalsIgnoreCase(principal.perfil());
    }

}
