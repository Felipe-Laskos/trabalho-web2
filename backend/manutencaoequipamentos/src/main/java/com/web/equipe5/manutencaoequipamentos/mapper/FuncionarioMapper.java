package com.web.equipe5.manutencaoequipamentos.mapper;


import com.web.equipe5.manutencaoequipamentos.dto.request.FuncionarioRequestDTO;
import com.web.equipe5.manutencaoequipamentos.dto.response.FuncionarioResponseDTO;
import com.web.equipe5.manutencaoequipamentos.model.Funcionario;

public class FuncionarioMapper {

    public static Funcionario toEntity(FuncionarioRequestDTO dto) {
        Funcionario f = new Funcionario();
        f.setNome(dto.getNome());
        f.setCpf(dto.getCpf());
        f.setEmail(dto.getEmail());
        f.setSenha(dto.getSenha());
        f.setCargo(dto.getCargo());
        f.setAtivo(dto.getAtivo());
        return f;
    }

    public static FuncionarioResponseDTO toDTO(Funcionario f) {
        return new FuncionarioResponseDTO(
            f.getId(),
            f.getNome(),
            f.getCpf(),
            f.getEmail(),
            f.getCargo(),
            f.getAtivo()
        );
    }
}