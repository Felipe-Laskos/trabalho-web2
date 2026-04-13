package com.web.equipe5.manutencaoequipamentos.model;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "funcionarios")

public class Funcionario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String cpf;
    private String email;
    // dps transformar a senha em hash
    private String senha;
    private LocalDate  dataNascimento;
    private String cargo;
    private Boolean ativo = true;
}