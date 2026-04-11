package com.web.equipe5.manutencaoequipamentos.entity;


import com.web.equipe5.manutencaoequipamentos.enums.EstadoSolicitacao;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_historico")
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
    @JoinColumn(name = "solicitacao_id")
    private Solicitacao solicitacao;

    @ManyToOne
    @JoinColumn(name = "funcionario_id")
    private Funcionario funcionario;

    @ManyToOne
    @JoinColumn(name = "funcionario_destino_id")
    private Funcionario funcionarioDestino;

public Long getId() {
        return id;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public EstadoSolicitacao getEstadoAnterior() {
        return estadoAnterior;
    }

    public void setEstadoAnterior(EstadoSolicitacao estadoAnterior) {
        this.estadoAnterior = estadoAnterior;
    }

    public EstadoSolicitacao getEstadoNovo() {
        return estadoNovo;
    }

    public void setEstadoNovo(EstadoSolicitacao estadoNovo) {
        this.estadoNovo = estadoNovo;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }

    public Solicitacao getSolicitacao() {
        return solicitacao;
    }

    public void setSolicitacao(Solicitacao solicitacao) {
        this.solicitacao = solicitacao;
    }

    public Funcionario getFuncionario() {
        return funcionario;
    }

    public void setFuncionario(Funcionario funcionario) {
        this.funcionario = funcionario;
    }

    public Funcionario getFuncionarioDestino() {
        return funcionarioDestino;
    }

    public void setFuncionarioDestino(Funcionario funcionarioDestino) {
        this.funcionarioDestino = funcionarioDestino;
    }
}