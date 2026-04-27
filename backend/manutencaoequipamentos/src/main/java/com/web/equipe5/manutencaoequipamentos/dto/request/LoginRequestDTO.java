package com.web.equipe5.manutencaoequipamentos.dto.request;

public record LoginRequestDTO(
    @NotBlank(message = "O nome é obrigatório.")
        @Size(min = 3, max = 100, message = "O nome deve ter entre 3 e 100 caracteres.")
        String nome,

        @NotBlank(message = "O CPF é obrigatório.")
        @Pattern(regexp = "\\d{11}", message = "O CPF deve conter exatamente 11 dígitos numéricos.")
        String cpf,

        @NotBlank(message = "O e-mail é obrigatório.")
        @Email(message = "O formato do e-mail é inválido.")
        String email,

        @NotBlank(message = "A palavra-passe é obrigatória.")
        @Size(min = 6, message = "A palavra-passe deve ter pelo menos 6 caracteres.")
        String senha,
        
        @Pattern(regexp = "\\d{10,11}", message = "O telefone deve ter entre 10 a 11 dígitos numéricos.")
        String telefone
) {}
