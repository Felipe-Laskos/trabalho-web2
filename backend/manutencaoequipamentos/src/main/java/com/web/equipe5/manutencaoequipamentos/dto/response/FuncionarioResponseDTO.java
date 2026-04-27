package com.web.equipe5.manutencaoequipamentos.dto.response;

import java.time.LocalDate;

public record FuncionarioResponseDTO(
    Long id,
    String nome,
    String cpf,
    String email,
    LocalDate dataNascimento,
    String cargo
) {}