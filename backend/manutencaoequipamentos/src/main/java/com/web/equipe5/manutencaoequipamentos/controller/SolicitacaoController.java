package com.web.equipe5.manutencaoequipamentos.controller;

import com.web.equipe5.manutencaoequipamentos.dto.RedirecionarRequestDTO;
import com.web.equipe5.manutencaoequipamentos.model.Solicitacao;
import com.web.equipe5.manutencaoequipamentos.service.SolicitacaoService;
import com.web.equipe5.manutencaoequipamentos.enums.EstadoSolicitacao;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/solicitacoes")
public class SolicitacaoController {

    private final SolicitacaoService service;

    public SolicitacaoController(SolicitacaoService service) {
        this.service = service;
    }

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

    @PatchMapping("/{id}/redirecionar")
    public ResponseEntity<Solicitacao> redirecionar(
            @PathVariable Long id,
            @RequestBody RedirecionarRequestDTO dto,
            @RequestHeader("X-Funcionario-Id") Long idFuncionarioLogado) {
        Long idFuncionarioDestino = dto.idFuncionarioDestino();
        
        return ResponseEntity.ok(service.redirecionar(id, idFuncionarioLogado, idFuncionarioDestino));
    }
    @PostMapping
    public ResponseEntity<Solicitacao> criar(@RequestBody Solicitacao solicitacao) {
        return ResponseEntity.ok(service.criar(solicitacao));
    }

    @PatchMapping("/{id}/orcar")
    public ResponseEntity<Solicitacao> orcar(
            @PathVariable Long id,
            @RequestParam Double valor,
            @RequestParam Long funcionarioId) {

        return ResponseEntity.ok(service.orcar(id, valor, funcionarioId));
    }

    @PatchMapping("/{id}/efetuar-manutencao")
    public ResponseEntity<Solicitacao> efetuarManutencao(@PathVariable Long id) {
        return ResponseEntity.ok(service.efetuarManutencao(id));
    }


    @PatchMapping("/{id}/finalizar")
    public ResponseEntity<Solicitacao> finalizar(@PathVariable Long id) {
        return ResponseEntity.ok(service.finalizar(id));
    }

}