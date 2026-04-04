import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Solicitacao } from '../../models/solicitacao.model';
import { Funcionario } from '../../models/funcionario.model';
import { Cliente } from '../../models/cliente.model';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { HistoricoService } from '../../services/historico.service';
import { SolicitacaoENUM } from '../../models/solicitacaoENUM.model';
import { CardVisualizacaoComponent } from '../../shared/card-visualizacao/card-visualizacao.component';
import { BotaoCancelarComponent } from '../../shared/botao-cancelar/botao-cancelar.component';
import { BotaoAprovarComponent } from '../../shared/botao-aprovar/botao-aprovar.component';
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

  private solicitacaoService = inject(SolicitacaoService);
  private historicoService = inject(HistoricoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

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
    this.solicitacao = this.solicitacaoService.buscarPorId(id);

    if (this.solicitacao) {
      const estado = this.solicitacao.estadoAtual?.toUpperCase();

      if (estado === 'ARRUMADA') {
        this.router.navigate(['/cliente/pagar', id]);
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

  alternarLeiaMais(): void {
    this.exibirDefeitoCompleto = !this.exibirDefeitoCompleto;
  }

  aprovarServico(): void {
    this.estadoModal = 'confirmacao';
    this.exibirModal = true;
  }

  confirmarAprovacao(): void {
    if (this.solicitacao) {
      this.historicoService.inserir({
        dataHora: new Date().toISOString(),
        estadoAnterior: this.solicitacao.estadoAtual,
        estadoNovo: SolicitacaoENUM.APROVADA,
        solicitacaoId: this.solicitacao.id!,
        observacao: `Serviço aprovado pelo cliente. Valor: R$ ${this.solicitacao.valorOrcado?.toFixed(2)}`
      });
      this.solicitacao.estadoAtual = SolicitacaoENUM.APROVADA;
      this.solicitacaoService.atualizar(this.solicitacao);
    }
    this.estadoModal = 'sucesso';
  }

  clickCancelar(): void {
    this.abrirModalRejeicao();
  }

  abrirModalRejeicao(): void {
    this.motivoRejeicaoTexto = '';
    this.estadoModal = 'confirmarRejeicao';
    this.exibirModal = true;
  }

  irParaMotivoRejeicao(): void {
    this.estadoModal = 'motivoRejeicao';
  }

  finalizarRejeicao(): void {
    if (this.solicitacao) {
      this.historicoService.inserir({
        dataHora: new Date().toISOString(),
        estadoAnterior: this.solicitacao.estadoAtual,
        estadoNovo: SolicitacaoENUM.REJEITADA,
        solicitacaoId: this.solicitacao.id!,
        observacao: `Serviço rejeitado. Motivo: ${this.motivoRejeicaoTexto}`
      });
      this.solicitacao.estadoAtual = SolicitacaoENUM.REJEITADA;
      this.solicitacao.motivoRejeicao = this.motivoRejeicaoTexto;
      this.solicitacaoService.atualizar(this.solicitacao);
    }
    this.estadoModal = 'sucessoRejeicao';
  }

  fecharERedirecionar(): void {
    this.exibirModal = false;
    this.estadoModal = 'confirmacao';
    this.router.navigate(['/cliente']);
  }

  fecharModal(): void {
    this.exibirModal = false;
    this.estadoModal = 'confirmacao';
    this.motivoRejeicaoTexto = '';
  }

  obterCorDoBadge(estado: string | undefined): string {
    if (!estado) return 'badge-cinza';
    switch (estado.toUpperCase()) {
      case 'ABERTA': return 'badge-cinza';
      case 'ORCADA': return 'badge-marrom';
      case 'REJEITADA': return 'badge-vermelho';
      case 'APROVADA': return 'badge-amarelo';
      case 'REDIRECIONADA': return 'badge-roxo';
      case 'ARRUMADA': return 'badge-azul';
      case 'PAGA': return 'badge-alaranjado';
      case 'FINALIZADA': return 'badge-verde';
      default: return 'badge-cinza';
    }
  }
}
