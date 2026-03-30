import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { mockSolicitacao } from '../..//mocks/solicitacao.mock';
import { Solicitacao } from '../../models/solicitacao.model';
import { Funcionario } from '../../models/funcionario.model';
import { Cliente } from '../../models/cliente.model';
import { CardVisualizacaoComponent } from '../../shared/card-visualizacao/card-visualizacao.component';
import { BotaoCancelarComponent } from '../../shared/botao-cancelar/botao-cancelar.component';
import { BotaoAprovarComponent } from '../../shared/botao-aprovar/botao-aprovar.component';
import { FormsModule } from '@angular/forms';
import { TextAreaComponent } from '../../shared/text-area/text-area.component';
import { BotaoComponent } from "../../shared/botao/botao.component";

@Component({
  selector: 'app-mostrar-orcamento',
  standalone: true,
  imports: [
    CommonModule,
    CardVisualizacaoComponent,
    BotaoCancelarComponent,
    BotaoAprovarComponent,
    FormsModule,
    TextAreaComponent,
    BotaoComponent
],
  templateUrl: './mostrar-orcamento.component.html',
  styleUrl: './mostrar-orcamento.component.css',
})
export class MostrarOrcamentoComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  solicitacao: Solicitacao | undefined;
  cliente: Cliente | undefined;
  funcionario: Funcionario | undefined;

  exibirModal: boolean = false;
  estadoModal:
    | 'confirmacao'
    | 'sucesso'
    | 'confirmarRejeicao'
    | 'motivoRejeicao'
    | 'sucessoRejeicao' = 'confirmacao';
  motivoRejeicaoTexto: string = '';
  exibirDefeitoCompleto: boolean = false;

 ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) return;

    const id = Number(idParam);
    this.solicitacao = mockSolicitacao.find((s) => s.id === id);

    if (this.solicitacao) {
      const estado = this.solicitacao.estadoAtual?.toUpperCase();

      if (estado === 'ARRUMADA') {
        this.router.navigate(['/cliente/pagar-servico', id]);
        return; 
      }

      const estadosBloqueados = ['PAGA', 'APROVADA', 'REJEITADA', 'FINALIZADA'];
      
      if (estado && estadosBloqueados.includes(estado)) {
        this.router.navigate(['/cliente']);
        return; 
      }
      this.cliente = this.solicitacao.cliente;
      this.funcionario = this.solicitacao.funcionarioResponsavel;
    }
  }

  alternarLeiaMais() {
    this.exibirDefeitoCompleto = !this.exibirDefeitoCompleto;
  }

  aprovarServico(): void {
    this.estadoModal = 'confirmacao';
    this.exibirModal = true;
  }

  confirmarAprovacao(): void {
    if (this.solicitacao) {
      this.solicitacao.estadoAtual = 'APROVADA';
    }
    this.estadoModal = 'sucesso';
  }

  clickCancelar() {
    this.abrirModalRejeicao();
  }

  abrirModalRejeicao() {
    this.motivoRejeicaoTexto = '';
    this.estadoModal = 'confirmarRejeicao';
    this.exibirModal = true;
  }

  irParaMotivoRejeicao() {
    this.estadoModal = 'motivoRejeicao';
  }

  finalizarRejeicao(): void {
    if (this.solicitacao) {
      this.solicitacao.estadoAtual = 'REJEITADA';
    }
    this.estadoModal = 'sucessoRejeicao';
  }

  fecharERedirecionar() {
  this.exibirModal = false;
  this.estadoModal = 'confirmacao'; 
  this.router.navigate(['/cliente']); 
}

  fecharModal() {
    this.exibirModal = false;
    this.estadoModal = 'confirmacao';
    this.motivoRejeicaoTexto = '';
  }

  obterCorDoBadge(estado: string | undefined): string {
    if (!estado) return 'badge-cinza'; 
    switch (estado.toUpperCase()) {
      case 'ABERTA':
        return 'badge-cinza';
      case 'ORCADA':
        return 'badge-marrom';
      case 'REJEITADA':
        return 'badge-vermelho';
      case 'APROVADA':
        return 'badge-amarelo';
      case 'REDIRECIONADA':
        return 'badge-roxo';
      case 'ARRUMADA':
        return 'badge-azul';
      case 'PAGA':
        return 'badge-alaranjado';
      case 'FINALIZADA':
        return 'badge-verde';
      default:
        return 'badge-cinza';
    }
  }
}
