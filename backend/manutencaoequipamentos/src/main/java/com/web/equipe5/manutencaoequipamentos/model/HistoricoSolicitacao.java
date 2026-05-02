package com.web.equipe5.manutencaoequipamentos.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.web.equipe5.manutencaoequipamentos.enums.EstadoSolicitacao;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "historicos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HistoricoSolicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime dataHora;

    @Enumerated(EnumType.STRING)
    private EstadoSolicitacao estadoAnterior;

    @Enumerated(EnumType.STRING)
    private EstadoSolicitacao estadoNovo;

    private String observacao;

    @ManyToOne
    @JsonIgnore 
    @JoinColumn(name = "solicitacao_id")
    private Solicitacao solicitacao;

    @ManyToOne
    @JoinColumn(name = "funcionario_id")
    private Funcionario funcionario;

    @ManyToOne
    @JoinColumn(name = "funcionario_destino_id")
    private Funcionario funcionarioDestino;

}