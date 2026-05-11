package com.web.equipe5.manutencaoequipamentos.controller;

import com.web.equipe5.manutencaoequipamentos.dto.ReceitaPorCategoriaProjection;
import com.web.equipe5.manutencaoequipamentos.dto.ReceitaPorDiaProjection;
import com.web.equipe5.manutencaoequipamentos.service.RelatorioService;
import com.web.equipe5.manutencaoequipamentos.service.RelatorioPdfService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.io.IOException;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import com.web.equipe5.manutencaoequipamentos.dto.request.RelatorioPeriodoRequest;

import jakarta.validation.Valid;

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
    public ResponseEntity<List<ReceitaPorDiaProjection>> gerarRelatorioReceitas(
            @RequestParam("dataInicio") LocalDate inicioDia,
            @RequestParam("dataFim") LocalDate fimDia) {
        List<ReceitaPorDiaProjection> receitas = relatorioService.gerarRelatorioReceitas(inicioDia, fimDia);
        return ResponseEntity.status(HttpStatus.OK).body(receitas);
    }

    @GetMapping("/receitas-categoria")
    public ResponseEntity<List<ReceitaPorCategoriaProjection>> gerarRelatorioCategorias() {
        List<ReceitaPorCategoriaProjection> categorias = relatorioService.gerarRelatorioCategorias();
        return ResponseEntity.status(HttpStatus.OK).body(categorias);
    }

    @GetMapping("/receitas-categoria/pdf")
    public ResponseEntity<byte[]> gerarRelatorioCategoriasPDF() throws IOException {

        byte[] pdf = relatorioPdfService.gerarRelatorioCategorias();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=RelatorioCategoria.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
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
