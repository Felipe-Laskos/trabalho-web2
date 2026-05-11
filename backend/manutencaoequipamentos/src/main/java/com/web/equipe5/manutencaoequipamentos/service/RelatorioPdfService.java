package com.web.equipe5.manutencaoequipamentos.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;

import com.web.equipe5.manutencaoequipamentos.dto.ReceitaPorCategoriaProjection;

@Service
public class RelatorioPdfService {

    private final RelatorioService relatorioService;

    public RelatorioPdfService(RelatorioService relatorioService) {
        this.relatorioService = relatorioService;
    }

    public byte[] gerarRelatorioCategorias() throws IOException {

        List<ReceitaPorCategoriaProjection> categorias =
                relatorioService.gerarRelatorioCategorias();

        ByteArrayOutputStream output = new ByteArrayOutputStream();

        PdfWriter writer = new PdfWriter(output);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        document.add(new Paragraph("Relatório de Receita por Categoria"));

        for (ReceitaPorCategoriaProjection categoria : categorias) {

            document.add(
                new Paragraph(
                    categoria.getNome()
                    + " - R$ "
                    + categoria.getTotal()
                )
            );
        }

        document.close();

        return output.toByteArray();
    }
}