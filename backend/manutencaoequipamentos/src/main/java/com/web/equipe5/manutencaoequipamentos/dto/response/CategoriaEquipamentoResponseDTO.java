package com.web.equipe5.manutencaoequipamentos.dto.response;

import com.web.equipe5.manutencaoequipamentos.model.CategoriaEquipamento;


public record CategoriaEquipamentoResponseDTO(
    Long id,
    String nome,
    Boolean ativo
) { 
    public CategoriaEquipamentoResponseDTO(CategoriaEquipamento cat) {
        this(
            cat.getId() != null ? cat.getId() : null,
            cat.getNome() != null ? cat.getNome() : null,
            cat.getAtivo()
        );
    }
} 

          