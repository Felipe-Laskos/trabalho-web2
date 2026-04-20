package com.web.equipe5.manutencaoequipamentos.mapper;

import com.web.equipe5.manutencaoequipamentos.model.Endereco;
import com.web.equipe5.manutencaoequipamentos.dto.request.EnderecoRequestDTO;
import com.web.equipe5.manutencaoequipamentos.dto.response.EnderecoResponseDTO;

public class EnderecoMapper {

    public static Endereco toEntity(EnderecoRequestDTO dto) {
        Endereco e = new Endereco();
        e.setCep(dto.cep());
        e.setLogradouro(dto.logradouro());
        e.setBairro(dto.bairro());
        e.setCidade(dto.cidade());
        e.setUf(dto.uf());
        e.setComplemento(dto.complemento());
        e.setNumero(dto.numero());
        return e;
    }

    public static EnderecoResponseDTO toDTO(Endereco e) {
        return new EnderecoResponseDTO(
            e.getId(),
            e.getCep(),
            e.getLogradouro(),
            e.getBairro(),
            e.getCidade(),
            e.getUf(),
            e.getComplemento(),
            e.getNumero()
        );
    }
}