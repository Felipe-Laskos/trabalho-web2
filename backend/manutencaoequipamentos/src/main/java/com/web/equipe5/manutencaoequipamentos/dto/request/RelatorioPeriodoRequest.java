package com.web.equipe5.manutencaoequipamentos.dto.request;

import jakarta.validation.constraints.NotNull;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

public record RelatorioPeriodoRequest(

    @NotNull(message = "A data de início é obrigatória")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    LocalDate inicio,

    @NotNull(message = "A data de fim é obrigatória")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    LocalDate fim

) {}