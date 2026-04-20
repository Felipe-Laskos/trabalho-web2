package com.web.equipe5.manutencaoequipamentos.mapper;

import com.web.equipe5.manutencaoequipamentos.model.CategoriaEquipamento;
import com.web.equipe5.manutencaoequipamentos.dto.request.CategoriaEquipamentoRequestDTO;
import com.web.equipe5.manutencaoequipamentos.dto.response.CategoriaEquipamentoResponseDTO;

public class CategoriaEquipamentoMapper {

    public static CategoriaEquipamento toEntity(CategoriaEquipamentoRequestDTO dto) {
        CategoriaEquipamento c = new CategoriaEquipamento();
        c.setNome(dto.nome());
        c.setAtivo(dto.ativo());
        return c;
    }

    public static CategoriaEquipamentoResponseDTO toDTO(CategoriaEquipamento c) {
        return new CategoriaEquipamentoResponseDTO(
            c.getId(),
            c.getNome(),
            c.getAtivo()
        );
    }
}
