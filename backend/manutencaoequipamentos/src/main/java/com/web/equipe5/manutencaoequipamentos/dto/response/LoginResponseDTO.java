package com.web.equipe5.manutencaoequipamentos.dto.response;

public record LoginResponseDTO(
    String token,
    long expiresInMs,
    Long id,
    String nome,
    String email,
    String perfil
) {}
