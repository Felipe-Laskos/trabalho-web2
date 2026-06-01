package com.web.equipe5.manutencaoequipamentos.controller;

import com.web.equipe5.manutencaoequipamentos.dto.ReceitaPorCategoriaProjection;
import com.web.equipe5.manutencaoequipamentos.dto.ReceitaPorDiaProjection;
import com.web.equipe5.manutencaoequipamentos.service.RelatorioService;
import com.web.equipe5.manutencaoequipamentos.service.RelatorioPdfService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.io.IOException;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import com.web.equipe5.manutencaoequipamentos.dto.request.RelatorioPeriodoRequest;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;

@RestController
@RequestMapping("/api/relatorios")
public class RelatorioController {
    private final RelatorioService relatorioService;
    private final RelatorioPdfService relatorioPdfService;

    public RelatorioController(RelatorioService relatorioService, RelatorioPdfService relatorioPdfService) {
        this.relatorioService = relatorioService;
        this.relatorioPdfService = relatorioPdfService;
    }

    @GetMapping("/receitas-periodo")
    public ResponseEntity<Page<ReceitaPorDiaProjection>> gerarRelatorioReceitas(
            @RequestParam(value = "dataInicio", required = false) LocalDate inicioDia,
            @RequestParam(value = "dataFim", required = false) LocalDate fimDia,
            @PageableDefault(size = 10) Pageable pageable) {
        Page<ReceitaPorDiaProjection> receitas = relatorioService.gerarRelatorioReceitas(inicioDia, fimDia, pageable);
        return ResponseEntity.status(HttpStatus.OK).body(receitas);
    }

    @GetMapping("/receitas-categoria")
    public ResponseEntity<Page<ReceitaPorCategoriaProjection>> gerarRelatorioCategorias(
        @RequestParam(required = false) String categoria,
        @PageableDefault(size = 10, sort = "nome") Pageable pageable) {
        Page<ReceitaPorCategoriaProjection> categorias = relatorioService.gerarRelatorioCategorias(categoria, pageable);
        return ResponseEntity.status(HttpStatus.OK).body(categorias);
    }

    @GetMapping("/receitas-categoria/pdf") 
    public ResponseEntity<byte[]> baixarPdfCategorias(
            @RequestParam(required = false) String categoria) throws IOException {
        
        byte[] pdf = relatorioPdfService.gerarRelatorioCategorias(categoria);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=relatorio-categorias.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/receitas-periodo/pdf")
    public ResponseEntity<byte[]> gerarPdf(
        @Valid @ModelAttribute RelatorioPeriodoRequest request
    ) throws IOException {

        byte[] pdf = relatorioService.gerarPdf(request.inicio(), request.fim());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=relatorio.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
