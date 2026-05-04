package com.web.equipe5.manutencaoequipamentos.dto.response;

import com.web.equipe5.manutencaoequipamentos.model.Cliente;

public record ClienteResponseDTO(
    Long id,
    String cpf,
    String nome,
    String email,
    String telefone,
    Boolean ativo,
    EnderecoResponseDTO endereco
) {
    public ClienteResponseDTO(Cliente c) {
        this(
            c.getId(),
            c.getCpf(),
            c.getNome(),
            c.getEmail() != null ? c.getEmail() : null,
            c.getTelefone() != null ? c.getTelefone() : null,
            c.getAtivo(),
            c.getEndereco() != null ? new EnderecoResponseDTO(c.getEndereco()) : null
        );
    }
} 
