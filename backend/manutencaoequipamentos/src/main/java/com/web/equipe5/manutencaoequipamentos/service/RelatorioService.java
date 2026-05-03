package com.web.equipe5.manutencaoequipamentos.service;

import com.web.equipe5.manutencaoequipamentos.dto.ReceitaPorDiaProjection;
import com.web.equipe5.manutencaoequipamentos.repository.SolicitacaoRepository;
import org.springframework.stereotype.Service;
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

    public List<ReceitaPorDiaProjection> gerarRelatorioReceitas(LocalDate inicio, LocalDate fim) {
        // Converte as datas recebidas para abranger as 24hr
        LocalDateTime inicioDia = inicio.atStartOfDay();
        LocalDateTime fimDia = fim.atTime(LocalTime.MAX);

        return solicitacaoRepository.findReceitasAgrupadasPorDia(inicioDia, fimDia);
    }
}