package com.web.equipe5.manutencaoequipamentos.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import java.time.LocalDate;

public record FuncionarioUpdateRequestDTO(
    @NotBlank(message = "O nome é obrigatório.")
    String nome,

    @NotBlank(message = "O e-mail é obrigatório.")
    @Email(message = "O formato do e-mail é inválido.")
    String email,

    @NotBlank(message = "O cargo é obrigatório.")
    String cargo,

    @Past(message = "A data de nascimento deve ser uma data no passado.")
    LocalDate dataNascimento,

    String senha,

    Boolean ativo
) {}
