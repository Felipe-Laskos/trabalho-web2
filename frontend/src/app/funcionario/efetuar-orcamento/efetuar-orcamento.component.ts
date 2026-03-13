import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Solicitacao } from '../../models/solicitacao.model';
import { SolicitacaoENUM } from '../../models/solicitacaoENUM.model';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-efetuar-orcamento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './efetuar-orcamento.component.html',
  styleUrl: './efetuar-orcamento.component.css'
})
export class EfetuarOrcamentoComponent {

  solicitacao?: Solicitacao;

  valorOrcamento: number = 0;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');

    this.solicitacao = {
      id: Number(id),
      dataHoraCriacao: '2026-03-03T10:30:00',
      descricaoEquipamento: 'Notebook Dell',
      descricaoDefeito: 'Não está carregando',
      estadoAtual: SolicitacaoENUM.ABERTA,
      cliente: {
        nome: 'Daniela',
        email: 'daniela@email.com',
        telefone: '41999999999'
      } as any
    };

  }

  registrarOrcamento() {

    if (!this.solicitacao) return;

    this.solicitacao.valorOrcado = this.valorOrcamento;
    this.solicitacao.estadoAtual = SolicitacaoENUM.ORCADA;

    alert("Orçamento registrado com sucesso!");

    console.log(this.solicitacao);
  }

}