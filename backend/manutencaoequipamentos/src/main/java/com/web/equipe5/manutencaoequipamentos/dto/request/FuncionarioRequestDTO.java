package com.web.equipe5.manutencaoequipamentos.dto.request;
import lombok.Data;

@Data
public class FuncionarioRequestDTO {
    private String nome;
    private String cpf;
    private String email;
    private String senha;
    private String cargo;
    private Boolean ativo;
}