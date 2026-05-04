package com.web.equipe5.manutencaoequipamentos.dto.response;

import com.web.equipe5.manutencaoequipamentos.model.Endereco;

public record EnderecoResponseDTO(
    Long id,
    String cep,
    String logradouro,
    String bairro,
    String cidade,
    String uf,
    String complemento,
    String numero
) {
    public EnderecoResponseDTO(Endereco e) {
        this(
            e.getId() != null ? e.getId() : null,
            e.getCep() != null ? e.getCep() : null,
            e.getLogradouro() != null ? e.getLogradouro() : null,
            e.getBairro() != null ? e.getBairro() : null,
            e.getCidade() != null ? e.getCidade() : null,
            e.getUf() != null ? e.getUf() : null,
            e.getComplemento() != null ? e.getComplemento() : null,
            e.getNumero() != null ? e.getNumero() : null
        );
    }
} 
           