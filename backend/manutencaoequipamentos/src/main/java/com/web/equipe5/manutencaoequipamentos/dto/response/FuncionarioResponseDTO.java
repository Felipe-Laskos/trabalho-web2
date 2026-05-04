package com.web.equipe5.manutencaoequipamentos.dto.response;

import com.web.equipe5.manutencaoequipamentos.model.Funcionario;
import java.time.LocalDate;

public record FuncionarioResponseDTO(
    Long id,
    String nome,
    String cpf,
    String email,
    LocalDate dataNascimento,
    String cargo
) {
    public FuncionarioResponseDTO(Funcionario f) {
        this(
            f.getId(),
            f.getNome(),
            f.getCpf(),
            f.getEmail() != null ? f.getEmail() : null,
            f.getDataNascimento(),
            f.getCargo() != null ? f.getCargo() : null
        );
    }
} 
        