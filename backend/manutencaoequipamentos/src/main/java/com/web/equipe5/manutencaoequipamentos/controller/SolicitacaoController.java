package com.web.equipe5.manutencaoequipamentos.controller;

import com.web.equipe5.manutencaoequipamentos.dto.RedirecionarRequestDTO;
import com.web.equipe5.manutencaoequipamentos.dto.request.EfetuarManutencaoRequestDTO;
import com.web.equipe5.manutencaoequipamentos.dto.request.OrcarRequestDTO;
import com.web.equipe5.manutencaoequipamentos.dto.request.SolicitacaoCreateRequestDTO;
import com.web.equipe5.manutencaoequipamentos.model.Solicitacao;
import com.web.equipe5.manutencaoequipamentos.config.JwtAuthenticationFilter.AuthenticatedPrincipal;
import com.web.equipe5.manutencaoequipamentos.service.SolicitacaoService;
import com.web.equipe5.manutencaoequipamentos.enums.EstadoSolicitacao;

// Imports adicionados para a entrega da Jess (Semana 10)
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/solicitacoes")
public class SolicitacaoController {

    private final SolicitacaoService service;

    public SolicitacaoController(SolicitacaoService service) {
        this.service = service;
    }

    // ========================================================================
    // MÉTODOS MANTIDOS DA EQUIPE
    // ========================================================================

    @PatchMapping("/{id}/aprovar")
    public ResponseEntity<Solicitacao> aprovar(@PathVariable Long id) {
        return ResponseEntity.ok(service.aprovar(id));
    }

    @PatchMapping("/{id}/rejeitar")
    public ResponseEntity<Solicitacao> rejeitar(@PathVariable Long id, @RequestParam String motivoRejeicao) {
        return ResponseEntity.ok(service.rejeitar(id, motivoRejeicao));
    }

    @PatchMapping("/{id}/resgatar")
    public ResponseEntity<Solicitacao> resgatar(@PathVariable Long id) {
        return ResponseEntity.ok(service.resgatar(id));
    }

    @PatchMapping("/{id}/pagar")
    public ResponseEntity<Solicitacao> pagar(@PathVariable Long id) {
        return ResponseEntity.ok(service.pagar(id));
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Solicitacao>> listarPorCliente(@PathVariable Long clienteId) {
        return ResponseEntity.ok(service.listarPorCliente(clienteId));
    }

    @GetMapping("/estado")
    public ResponseEntity<List<Solicitacao>> listarPorEstado(@RequestParam EstadoSolicitacao estadoAtual) {
        return ResponseEntity.ok(service.listarPorEstado(estadoAtual));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Solicitacao> buscarPorId(@PathVariable Long id, @AuthenticationPrincipal AuthenticatedPrincipal principal) {
        return ResponseEntity.ok(service.buscarPorIdECliente(id, principal));
    }

    @PatchMapping("/{id}/finalizar")
    public ResponseEntity<Solicitacao> finalizar(@PathVariable Long id, @AuthenticationPrincipal AuthenticatedPrincipal principal) {
        return ResponseEntity.ok(service.finalizar(id, principal.id()));
    }

    // Adicionado @valid nos requestsbody

    @PatchMapping("/{id}/redirecionar")
    public ResponseEntity<Solicitacao> redirecionar(
            @PathVariable Long id,
            @Valid @RequestBody RedirecionarRequestDTO dto,
            @AuthenticationPrincipal AuthenticatedPrincipal principal) {
        return ResponseEntity.ok(
            service.redirecionar(id, principal, dto.idFuncionarioDestino())
        );
    }

    @PostMapping
    public ResponseEntity<Solicitacao> criar(
            @Valid @RequestBody SolicitacaoCreateRequestDTO request,
            @AuthenticationPrincipal AuthenticatedPrincipal principal) {

        return ResponseEntity.ok(service.criar(request, principal.id()));
    }

    @PatchMapping("/{id}/orcar")
    public ResponseEntity<Solicitacao> orcar(
            @PathVariable Long id,
            @Valid @RequestBody OrcarRequestDTO request,
            @AuthenticationPrincipal AuthenticatedPrincipal principal) {

        return ResponseEntity.ok(
            service.orcar(id, request.valor(), principal.id())
        );
    }

    @PatchMapping("/{id}/efetuar-manutencao")
    public ResponseEntity<Solicitacao> efetuarManutencao(
            @PathVariable Long id,
            @Valid @RequestBody EfetuarManutencaoRequestDTO dto,
            @AuthenticationPrincipal AuthenticatedPrincipal principal) {
        Long funcionarioId = principal.id();
        return ResponseEntity.ok(service.efetuarManutencao(id, dto, funcionarioId));
    }

    // Endpoint de paginação dos filtros
    @GetMapping("/filtros")
    public ResponseEntity<Page<Solicitacao>> listarComFiltros(
            @RequestParam(defaultValue = "TODAS") String filtro,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim,
            @PageableDefault(size = 4, sort = "dataHoraCriacao", direction = Sort.Direction.DESC) Pageable pageable) {
        
        Page<Solicitacao> page = service.listarComFiltros(filtro, dataInicio, dataFim, pageable);
        return ResponseEntity.ok(page);
    }
}