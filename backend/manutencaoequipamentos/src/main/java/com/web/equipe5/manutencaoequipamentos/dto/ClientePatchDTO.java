package com.web.equipe5.manutencaoequipamentos.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import com.web.equipe5.manutencaoequipamentos.dto.request.EnderecoRequestDTO;

public record ClientePatchDTO(
        @Size(min = 3, max = 100, message = "O nome deve ter entre 3 e 100 caracteres.")
        String nome,

        @Email(message = "O formato do e-mail é inválido.")
        String email,

        @Pattern(regexp = "\\d{10,11}", message = "O telefone deve ter entre 10 a 11 dígitos numéricos.")
        String telefone,

        @Valid
        EnderecoRequestDTO endereco,

        Boolean ativo,

        String senha

) {}
