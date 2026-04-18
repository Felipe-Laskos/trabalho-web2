package com.web.equipe5.manutencaoequipamentos.dto.response;

public record FuncionarioResponseDTO(
    Long id,
    String nome,
    String cpf,
    String email,
    String cargo,
    Boolean ativo
) {}