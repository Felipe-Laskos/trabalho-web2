package com.web.equipe5.manutencaoequipamentos.dto.request;

public record EnderecoRequestDTO(
    String cep,
    String logradouro,
    String bairro,
    String cidade,
    String uf,
    String complemento,
    String numero
) {}