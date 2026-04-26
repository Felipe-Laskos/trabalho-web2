package com.web.equipe5.manutencaoequipamentos.model;

import com.web.equipe5.manutencaoequipamentos.enums.EstadoSolicitacao;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "solicitacoes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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
    private LocalDateTime dataHoraManutencao;
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

}