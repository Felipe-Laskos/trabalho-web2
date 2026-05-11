package com.web.equipe5.manutencaoequipamentos.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.web.equipe5.manutencaoequipamentos.model.HistoricoSolicitacao;
import com.web.equipe5.manutencaoequipamentos.service.HistoricoService;

import java.util.List;

@RestController
@RequestMapping("/api/solicitacoes")
public class HistoricoController {

    private final HistoricoService historicoService;

    public HistoricoController(HistoricoService historicoService) {
        this.historicoService = historicoService;
    }

    @GetMapping("/{id}/historico")
    public ResponseEntity<List<HistoricoSolicitacao>> historico(@PathVariable Long id) {
        return ResponseEntity.ok(historicoService.listarPorSolicitacao(id));
    }
}
