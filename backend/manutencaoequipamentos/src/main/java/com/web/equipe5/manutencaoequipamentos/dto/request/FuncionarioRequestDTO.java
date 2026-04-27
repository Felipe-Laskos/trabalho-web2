package com.web.equipe5.manutencaoequipamentos.dto.request;
import java.time.LocalDate;

public record FuncionarioRequestDTO(
    String nome,
    String cpf,
    String email,
    String senha,
    String cargo,
    LocalDate dataNascimento
) {}