package com.web.equipe5.manutencaoequipamentos.controller;

import java.io.IOException;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.web.equipe5.manutencaoequipamentos.service.RelatorioPdfService;

@RestController
@RequestMapping("/api/relatorios")
public class RelatorioController {

    private final RelatorioPdfService service;

    public RelatorioController(RelatorioPdfService service) {
        this.service = service;
    }

    @GetMapping("/pdf")
    public ResponseEntity<byte[]> gerarPdf() throws IOException {

        byte[] pdf = service.gerarRelatorio();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=relatorio.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}