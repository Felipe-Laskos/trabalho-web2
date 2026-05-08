package com.web.equipe5.manutencaoequipamentos.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record EnderecoRequestDTO(
    @NotBlank(message = "O CEP é obrigatório.")
    @Pattern(regexp = "\\d{5}-\\d{3}", message = "O CEP deve estar no formato 00000-000")
    String cep,

    @NotBlank(message = "O logradouro é obrigatório.")
    @Size(min = 3, max = 100, message = "O logradouro deve ter entre 3 e 100 caracteres.")  
    String logradouro,

    @NotBlank(message = "O bairro é obrigatório.")
    @Size(min = 3, max = 100, message = "O bairro deve ter entre 3 e 100 caracteres.")
    String bairro,

    @NotBlank(message = "A cidade é obrigatória.")
    @Size(min = 3, max = 100, message = "A cidade deve ter entre 3 e 100 caracteres.")
    String cidade,

    @NotBlank(message = "O uf é obrigatório.")
    @Pattern(regexp = "^[A-Z]{2}$", message = "A uf deve conter exatamente 2 letras maiúsculas (Ex: PR, SP).")
    String uf,

    @Size(max = 100, message = "O complemento não pode passar de 100 caracteres.")
    String complemento,

    @NotBlank(message = "O número é obrigatório.")
    @Size(max = 10, message = "O número é muito longo.")
    String numero
) {}