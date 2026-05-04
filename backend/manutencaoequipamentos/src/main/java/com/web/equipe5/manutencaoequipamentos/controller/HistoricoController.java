package com.web.equipe5.manutencaoequipamentos.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.web.equipe5.manutencaoequipamentos.service.HistoricoService;
import com.web.equipe5.manutencaoequipamentos.dto.response.HistoricoSolicitacaoResponseDTO;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/solicitacoes")
public class HistoricoController {

    private final HistoricoService historicoService;

    public HistoricoController(HistoricoService historicoService) {
        this.historicoService = historicoService;
    }

    @GetMapping("/{id}/historico")
    public ResponseEntity<List<HistoricoSolicitacaoResponseDTO>> historico(@PathVariable Long id) {
        List<HistoricoSolicitacaoResponseDTO> historicoDTOs = historicoService.listarPorSolicitacao(id)
            .stream().map(HistoricoSolicitacaoResponseDTO::new).collect(Collectors.toList());
        return ResponseEntity.ok(historicoDTOs);
    }
}
