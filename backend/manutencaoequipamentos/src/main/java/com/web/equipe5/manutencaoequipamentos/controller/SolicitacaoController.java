package com.web.equipe5.manutencaoequipamentos.controller;

import com.web.equipe5.manutencaoequipamentos.dto.request.EfetuarManutencaoRequestDTO;
import com.web.equipe5.manutencaoequipamentos.dto.request.RedirecionarRequestDTO;
import com.web.equipe5.manutencaoequipamentos.dto.request.OrcarRequestDTO;
import com.web.equipe5.manutencaoequipamentos.dto.request.SolicitacaoCreateRequestDTO;
import com.web.equipe5.manutencaoequipamentos.dto.response.SolicitacaoResponseDTO;
import com.web.equipe5.manutencaoequipamentos.config.JwtAuthenticationFilter.AuthenticatedPrincipal;
import com.web.equipe5.manutencaoequipamentos.service.SolicitacaoService;

import jakarta.validation.Valid;

import com.web.equipe5.manutencaoequipamentos.enums.EstadoSolicitacao;
import com.web.equipe5.manutencaoequipamentos.mapper.SolicitacaoMapper;
import com.web.equipe5.manutencaoequipamentos.model.Solicitacao;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/solicitacoes")
public class SolicitacaoController {

    private final SolicitacaoService service;

    public SolicitacaoController(SolicitacaoService service) {
        this.service = service;
    }

    @PatchMapping("/{id}/aprovar") 
    public ResponseEntity<SolicitacaoResponseDTO> aprovar(@PathVariable Long id) {
        Solicitacao s = service.aprovar(id);
        return ResponseEntity.ok(new SolicitacaoResponseDTO(s));
    }

    @PatchMapping("/{id}/rejeitar")
    public ResponseEntity<SolicitacaoResponseDTO> rejeitar(@PathVariable Long id, @RequestParam String motivoRejeicao) {
        Solicitacao s = service.rejeitar(id, motivoRejeicao);
        return ResponseEntity.ok(new SolicitacaoResponseDTO(s));
    }

    @PatchMapping("/{id}/resgatar")
    public ResponseEntity<SolicitacaoResponseDTO> resgatar(@PathVariable Long id) {
        Solicitacao s = service.resgatar(id);
        return ResponseEntity.ok(new SolicitacaoResponseDTO(s));
    }

    @PatchMapping("/{id}/pagar")
    public ResponseEntity<SolicitacaoResponseDTO> pagar(@PathVariable Long id) {
        Solicitacao s = service.pagar(id);
        return ResponseEntity.ok(new SolicitacaoResponseDTO(s));
    }

    @GetMapping("/cliente/{clienteId}") 
    public ResponseEntity<List<SolicitacaoResponseDTO>> listarPorCliente(@PathVariable Long clienteId) {
        List<SolicitacaoResponseDTO> dtos = service.listarPorCliente(clienteId).stream()
            .map(SolicitacaoResponseDTO::new)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }


    @GetMapping("/estado")
    public ResponseEntity<Page<SolicitacaoResponseDTO>> listarPorEstado(
            @RequestParam EstadoSolicitacao estadoAtual,
            Pageable pageable) {

        Page<SolicitacaoResponseDTO> dtos = service
                .listarPorEstado(estadoAtual, pageable)
                .map(SolicitacaoResponseDTO::new);
        return ResponseEntity.ok(dtos);
    }
    
    @GetMapping("/filtros")
    public ResponseEntity<Page<SolicitacaoResponseDTO>> listarComFiltros(
            @RequestParam String filtro,
            @RequestParam(required = false) String dataInicio,
            @RequestParam(required = false) String dataFim,
            Pageable pageable
    ) {

        Page<SolicitacaoResponseDTO> solicitacoes = service
                .listarComFiltros(filtro, dataInicio, dataFim, pageable)
                .map(SolicitacaoResponseDTO::new);

        return ResponseEntity.ok(solicitacoes);
    }

    @GetMapping("/{id}") 
    public ResponseEntity<SolicitacaoResponseDTO> buscarPorId(@PathVariable Long id, @AuthenticationPrincipal AuthenticatedPrincipal principal) {
        Solicitacao s = service.buscarPorIdECliente(id, principal);
        return ResponseEntity.ok(new SolicitacaoResponseDTO(s));
    }

    @PatchMapping("/{id}/redirecionar")
    public ResponseEntity<SolicitacaoResponseDTO> redirecionar(
            @PathVariable Long id,
            @Valid @RequestBody RedirecionarRequestDTO dto,
            @AuthenticationPrincipal AuthenticatedPrincipal principal) {
        Solicitacao s = service.redirecionar(id, principal, dto.idFuncionarioDestino());
        return ResponseEntity.ok(new SolicitacaoResponseDTO(s));
    }

    @PostMapping 
    public ResponseEntity<SolicitacaoResponseDTO> criar(
            @Valid @RequestBody SolicitacaoCreateRequestDTO request,
            @AuthenticationPrincipal AuthenticatedPrincipal principal) {

        Solicitacao s = service.criar(request, principal.id());
        return ResponseEntity.status(HttpStatus.CREATED).body(new SolicitacaoResponseDTO(s));
    }

    @PatchMapping("/{id}/orcar")
    public ResponseEntity<SolicitacaoResponseDTO> orcar(
            @PathVariable Long id,
            @Valid @RequestBody OrcarRequestDTO request,
            @AuthenticationPrincipal AuthenticatedPrincipal principal) {
        Solicitacao s = service.orcar(id, request.valor(), principal.id());
        return ResponseEntity.ok(new SolicitacaoResponseDTO(s));
    }

    @PatchMapping("/{id}/efetuar-manutencao")
    public ResponseEntity<SolicitacaoResponseDTO> efetuarManutencao(
            @PathVariable Long id,
            @Valid @RequestBody EfetuarManutencaoRequestDTO dto,
            @AuthenticationPrincipal AuthenticatedPrincipal principal) {
        Long funcionarioId = principal.id();
        Solicitacao s = service.efetuarManutencao(id, dto, funcionarioId);
        return ResponseEntity.ok(new SolicitacaoResponseDTO(s));
    }

    @PatchMapping("/{id}/finalizar")
    public ResponseEntity<SolicitacaoResponseDTO> finalizar(@PathVariable Long id, @AuthenticationPrincipal AuthenticatedPrincipal principal) {
        Solicitacao s = service.finalizar(id, principal.id());
        return ResponseEntity.ok(new SolicitacaoResponseDTO(s));
    }


    @GetMapping
    public ResponseEntity<Page<SolicitacaoResponseDTO>> listarTodos(
            @AuthenticationPrincipal AuthenticatedPrincipal principal,
            Pageable pageable
    ) {
        if (principal == null) {
            throw new AccessDeniedException("Funcionário não autenticado");
        }

        Page<SolicitacaoResponseDTO> solicitacoes = service
                .listarTodos(pageable)
                .map(SolicitacaoMapper::toDTO);

        return ResponseEntity.ok(solicitacoes);
    }


}
