package com.web.equipe5.manutencaoequipamentos.dto.request;

import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

public record RelatorioPeriodoRequest(

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    LocalDate inicio,

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    LocalDate fim

) {}
