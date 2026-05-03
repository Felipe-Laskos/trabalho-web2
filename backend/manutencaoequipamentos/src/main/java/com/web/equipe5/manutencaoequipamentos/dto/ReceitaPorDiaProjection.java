package com.web.equipe5.manutencaoequipamentos.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface ReceitaPorDiaProjection { 
    LocalDate getData();
    BigDecimal getTotal(); 
}