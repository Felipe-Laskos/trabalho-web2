package com.web.equipe5.manutencaoequipamentos.dto.response;

public record ClienteResponseDTO(
    Long id,
    String cpf,
    String nome,
    String email,
    String telefone,
    Boolean ativo,
    EnderecoResponseDTO endereco
) {}