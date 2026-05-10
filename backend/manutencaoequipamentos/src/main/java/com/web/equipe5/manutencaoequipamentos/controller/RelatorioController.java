package com.web.equipe5.manutencaoequipamentos.controller;

import java.io.IOException;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.web.equipe5.manutencaoequipamentos.dto.request.RelatorioPeriodoRequest;
import com.web.equipe5.manutencaoequipamentos.service.RelatorioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/relatorios")
public class RelatorioController {

    private final RelatorioService service;

    public RelatorioController(RelatorioService service) {
        this.service = service;
    }

    @GetMapping("/receitas-periodo")
    public ResponseEntity<byte[]> gerarPdf(
        @Valid @ModelAttribute RelatorioPeriodoRequest request
    ) throws IOException {

        byte[] pdf = service.gerarPdf(request.inicio(), request.fim());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=relatorio.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}