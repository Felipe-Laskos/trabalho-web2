package com.web.equipe5.manutencaoequipamentos.mapper;

import java.time.LocalDateTime;
import com.web.equipe5.manutencaoequipamentos.dto.request.ClienteRequestDTO;
import com.web.equipe5.manutencaoequipamentos.dto.response.ClienteResponseDTO;
import com.web.equipe5.manutencaoequipamentos.model.Cliente;

public class ClienteMapper {

    public static Cliente toEntity(ClienteRequestDTO dto) {
        Cliente c = new Cliente();
        c.setCpf(dto.cpf());
        c.setNome(dto.nome());
        c.setEmail(dto.email());
        c.setTelefone(dto.telefone());
        c.setAtivo(true);
        c.setDataCadastro(LocalDateTime.now());

        if (dto.endereco() != null) {
            c.setEndereco(EnderecoMapper.toEntity(dto.endereco()));
        }

        return c;
    }

    public static ClienteResponseDTO toDTO(Cliente c) {
        return new ClienteResponseDTO(
            c.getId(),
            c.getCpf(),
            c.getNome(),
            c.getEmail(),
            c.getTelefone(),
            c.getAtivo(),
            c.getEndereco() != null ? EnderecoMapper.toDTO(c.getEndereco()) : null
        );
    }
}