package com.web.equipe5.manutencaoequipamentos.service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.web.equipe5.manutencaoequipamentos.dto.ReceitaPorDiaProjection;
import com.web.equipe5.manutencaoequipamentos.repository.SolicitacaoRepository;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class RelatorioService {

    private final SolicitacaoRepository solicitacaoRepository;

    public RelatorioService(SolicitacaoRepository solicitacaoRepository) {
        this.solicitacaoRepository = solicitacaoRepository;
    }

    public List<ReceitaPorDiaProjection> gerarRelatorioReceitas(
            LocalDate inicio,
            LocalDate fim
    ) {
        LocalDateTime inicioDia = inicio.atStartOfDay();
        LocalDateTime fimDia = fim.atTime(LocalTime.MAX);

        return solicitacaoRepository.findReceitasAgrupadasPorDia(inicioDia, fimDia);
    }

    public byte[] gerarPdf(LocalDate inicio, LocalDate fim) throws IOException {

        List<ReceitaPorDiaProjection> dados =
                gerarRelatorioReceitas(inicio, fim);

        ByteArrayOutputStream output = new ByteArrayOutputStream();

        PdfWriter writer = new PdfWriter(output);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        document.add(new Paragraph("Relatório de Receitas"));
        document.add(new Paragraph("Período: " + inicio + " até " + fim));
        document.add(new Paragraph(" "));

        for (ReceitaPorDiaProjection item : dados) {
            document.add(new Paragraph(
                    item.getData() + " - R$ " + item.getTotal()
            ));
        }

        document.close();

        return output.toByteArray();
    }
}