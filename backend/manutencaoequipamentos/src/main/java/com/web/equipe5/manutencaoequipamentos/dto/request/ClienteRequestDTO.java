package com.web.equipe5.manutencaoequipamentos.dto.request;

public record ClienteRequestDTO(
    String cpf,
    String nome,
    String email,
    String senha,
    String telefone,
    EnderecoRequestDTO endereco
) {}