package com.web.equipe5.manutencaoequipamentos.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.web.equipe5.manutencaoequipamentos.service.HistoricoService;
import com.web.equipe5.manutencaoequipamentos.dto.response.HistoricoSolicitacaoResponseDTO;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/solicitacoes")
public class HistoricoController {

    private final HistoricoService historicoService;

    public HistoricoController(HistoricoService historicoService) {
        this.historicoService = historicoService;
    }

    @GetMapping("/{id}/historico")
    public ResponseEntity<Page<HistoricoSolicitacaoResponseDTO>> historico(@PathVariable Long id, Pageable pageable) {
        Page<HistoricoSolicitacaoResponseDTO> historicoDTOs = historicoService.listarPorSolicitacao(id, pageable).map(HistoricoSolicitacaoResponseDTO::new);
        return ResponseEntity.ok(historicoDTOs);
    }
}
