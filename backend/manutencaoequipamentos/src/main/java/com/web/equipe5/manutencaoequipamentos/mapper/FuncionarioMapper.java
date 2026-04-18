package com.web.equipe5.manutencaoequipamentos.mapper;


import com.web.equipe5.manutencaoequipamentos.dto.request.FuncionarioRequestDTO;
import com.web.equipe5.manutencaoequipamentos.dto.response.FuncionarioResponseDTO;
import com.web.equipe5.manutencaoequipamentos.model.Funcionario;

public class FuncionarioMapper {

    public static Funcionario toEntity(FuncionarioRequestDTO dto) {
        Funcionario f = new Funcionario();
        f.setNome(dto.nome());
        f.setCpf(dto.cpf());
        f.setEmail(dto.email());
        f.setSenha(dto.senha());
        f.setDataNascimento(dto.dataNascimento());
        f.setCargo(dto.cargo());
        f.setAtivo(true);
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