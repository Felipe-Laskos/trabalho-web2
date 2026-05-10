package com.web.equipe5.manutencaoequipamentos.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;


public record LoginRequestDTO(

    @NotBlank(message = "O email é obrigatório.")
    @Email(message = "Digite um email válido.")
    String email,
    
    @NotBlank(message = "A senha é obrigatória.")
    String senha
) {}
