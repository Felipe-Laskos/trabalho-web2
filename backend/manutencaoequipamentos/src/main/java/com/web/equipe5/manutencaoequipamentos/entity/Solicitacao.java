package com.web.equipe5.manutencaoequipamentos.entity;

import com.web.equipe5.manutencaoequipamentos.enums.EstadoSolicitacao;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "tb_solicitacao")
public class Solicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String descricaoEquipamento;
    private String descricaoDefeito;

    @Enumerated(EnumType.STRING)
    private EstadoSolicitacao estadoAtual;

    private Double valorOrcado;
    private String funcionarioOrcamento;
    private LocalDateTime dataHoraOrcamento;

    private String motivoRejeicao;
    private String descricaoManutencao;
    private String orientacoesCliente;

    private LocalDateTime dataHoraCriacao;
    private LocalDateTime dataHoraPagamento;
    private LocalDateTime dataHoraFinalizacao;

    private Boolean ativo;
 
    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private CategoriaEquipamento categoriaEquipamento;

    @ManyToOne
    @JoinColumn(name = "funcionario_responsavel_id")
    private Funcionario funcionarioResponsavel;

    @OneToMany(mappedBy = "solicitacao", cascade = CascadeType.ALL)
    private List<HistoricoSolicitacao> historico;

    public Long getId() {
        return id;
    }

    public String getDescricaoEquipamento() {
        return descricaoEquipamento;
    }

    public void setDescricaoEquipamento(String descricaoEquipamento) {
        this.descricaoEquipamento = descricaoEquipamento;
    }

    public String getDescricaoDefeito() {
        return descricaoDefeito;
    }

    public void setDescricaoDefeito(String descricaoDefeito) {
        this.descricaoDefeito = descricaoDefeito;
    }

    public EstadoSolicitacao getEstadoAtual() {
        return estadoAtual;
    }

    public void setEstadoAtual(EstadoSolicitacao estadoAtual) {
        this.estadoAtual = estadoAtual;
    }

    public Double getValorOrcado() {
        return valorOrcado;
    }

    public void setValorOrcado(Double valorOrcado) {
        this.valorOrcado = valorOrcado;
    }

    public String getFuncionarioOrcamento() {
        return funcionarioOrcamento;
    }

    public void setFuncionarioOrcamento(String funcionarioOrcamento) {
        this.funcionarioOrcamento = funcionarioOrcamento;
    }

    public LocalDateTime getDataHoraOrcamento() {
        return dataHoraOrcamento;
    }

    public void setDataHoraOrcamento(LocalDateTime dataHoraOrcamento) {
        this.dataHoraOrcamento = dataHoraOrcamento;
    }

    public String getMotivoRejeicao() {
        return motivoRejeicao;
    }

    public void setMotivoRejeicao(String motivoRejeicao) {
        this.motivoRejeicao = motivoRejeicao;
    }

    public String getDescricaoManutencao() {
        return descricaoManutencao;
    }

    public void setDescricaoManutencao(String descricaoManutencao) {
        this.descricaoManutencao = descricaoManutencao;
    }

    public String getOrientacoesCliente() {
        return orientacoesCliente;
    }

    public void setOrientacoesCliente(String orientacoesCliente) {
        this.orientacoesCliente = orientacoesCliente;
    }

    public LocalDateTime getDataHoraCriacao() {
        return dataHoraCriacao;
    }

    public void setDataHoraCriacao(LocalDateTime dataHoraCriacao) {
        this.dataHoraCriacao = dataHoraCriacao;
    }

    public LocalDateTime getDataHoraPagamento() {
        return dataHoraPagamento;
    }

    public void setDataHoraPagamento(LocalDateTime dataHoraPagamento) {
        this.dataHoraPagamento = dataHoraPagamento;
    }

    public LocalDateTime getDataHoraFinalizacao() {
        return dataHoraFinalizacao;
    }

    public void setDataHoraFinalizacao(LocalDateTime dataHoraFinalizacao) {
        this.dataHoraFinalizacao = dataHoraFinalizacao;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public CategoriaEquipamento getCategoria() {
        return categoriaEquipamento;
    }

    public void setCategoria(CategoriaEquipamento categoriaEquipamento) {
        this.categoriaEquipamento = categoriaEquipamento;
    }

    public Funcionario getFuncionarioResponsavel() {
        return funcionarioResponsavel;
    }

    public void setFuncionarioResponsavel(Funcionario funcionarioResponsavel) {
        this.funcionarioResponsavel = funcionarioResponsavel;
    }

    public List<HistoricoSolicitacao> getHistorico() {
        return historico;
    }

    public void setHistorico(List<HistoricoSolicitacao> historico) {
        this.historico = historico;
    }
}