package com.web.equipe5.manutencaoequipamentos.dto.response;

public record EnderecoResponseDTO(
    Long id,
    String cep,
    String logradouro,
    String bairro,
    String cidade,
    String uf,
    String complemento,
    String numero
) {}