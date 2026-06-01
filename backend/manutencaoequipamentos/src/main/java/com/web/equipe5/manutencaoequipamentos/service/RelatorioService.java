package com.web.equipe5.manutencaoequipamentos.service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.web.equipe5.manutencaoequipamentos.dto.ReceitaPorDiaProjection;
import com.web.equipe5.manutencaoequipamentos.dto.ReceitaPorCategoriaProjection;
import com.web.equipe5.manutencaoequipamentos.repository.SolicitacaoRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Service
public class RelatorioService {

    private static final DateTimeFormatter FORMATO_DATA_BR =
            DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private static final Locale LOCALE_BR = Locale.forLanguageTag("pt-BR");

    private final SolicitacaoRepository solicitacaoRepository;

    public RelatorioService(SolicitacaoRepository solicitacaoRepository) {
        this.solicitacaoRepository = solicitacaoRepository;
    }

    public List<ReceitaPorDiaProjection> gerarRelatorioReceitas(
            LocalDate inicio,
            LocalDate fim
    ) {
        LocalDateTime inicioDia = normalizarInicio(inicio);
        LocalDateTime fimDia = normalizarFim(fim);

        return solicitacaoRepository.findReceitasAgrupadasPorDia(inicioDia, fimDia);
    }

    public Page<ReceitaPorDiaProjection> gerarRelatorioReceitas(
            LocalDate inicio,
            LocalDate fim,
            Pageable pageable
    ) {
        LocalDateTime inicioDia = normalizarInicio(inicio);
        LocalDateTime fimDia = normalizarFim(fim);

        return solicitacaoRepository.findReceitasAgrupadasPorDia(inicioDia, fimDia, pageable);
    }

    public List<ReceitaPorCategoriaProjection> gerarRelatorioCategorias(String categoria) {
        return solicitacaoRepository.findReceitasAgrupadasPorCategoria(categoria);
    }

    public Page<ReceitaPorCategoriaProjection> gerarRelatorioCategorias(String categoria, Pageable pageable) {
        return solicitacaoRepository.findReceitasAgrupadasPorCategoria(categoria, pageable);
    }
    
    public byte[] gerarPdf(LocalDate inicio, LocalDate fim) throws IOException {

        List<ReceitaPorDiaProjection> dados =
                gerarRelatorioReceitas(inicio, fim);

        ByteArrayOutputStream output = new ByteArrayOutputStream();

        PdfWriter writer = new PdfWriter(output);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        document.add(new Paragraph("Relatório de Receitas"));
        document.add(new Paragraph("Período: " + formatarPeriodo(inicio, fim)));
        document.add(new Paragraph(" "));

        for (ReceitaPorDiaProjection item : dados) {
            document.add(new Paragraph(
                    formatarData(item.getData()) + " - " + formatarMoeda(item.getTotal())
            ));
        }

        document.close();

        return output.toByteArray();
    }

    public String formatarMoeda(Number valor) {
        if (valor == null) {
            return NumberFormat.getCurrencyInstance(LOCALE_BR).format(0);
        }
        return NumberFormat.getCurrencyInstance(LOCALE_BR).format(valor);
    }

    private String formatarData(LocalDate data) {
        return data.format(FORMATO_DATA_BR);
    }

    private LocalDateTime normalizarInicio(LocalDate inicio) {
        return inicio != null
                ? inicio.atStartOfDay()
                : LocalDate.of(1900, 1, 1).atStartOfDay();
    }

    private LocalDateTime normalizarFim(LocalDate fim) {
        return fim != null
                ? fim.atTime(LocalTime.MAX)
                : LocalDate.now().atTime(LocalTime.MAX);
    }

    private String formatarPeriodo(LocalDate inicio, LocalDate fim) {
        String inicioFormatado = inicio != null ? formatarData(inicio) : "início";
        String fimFormatado = fim != null ? formatarData(fim) : "hoje";

        return inicioFormatado + " até " + fimFormatado;
    }
}
