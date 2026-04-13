import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Solicitacao } from '../../core/models/solicitacao.model';
import { HistoricoSolicitacao } from '../../core/models/historico.model';
import { CardVisualizacaoComponent } from '../../shared/card-visualizacao/card-visualizacao.component';
import { BotaoComponent } from '../../shared/botao/botao.component';
import { BotaoAprovarComponent } from '../../shared/botao-aprovar/botao-aprovar.component';
import { BotaoCancelarComponent } from '../../shared/botao-cancelar/botao-cancelar.component';
import { SolicitacaoService } from '../../core/services/solicitacao.service';
import { HistoricoService } from '../../core/services/historico.service';
import { SolicitacaoENUM } from '../../core/models/solicitacaoENUM.model';

@Component({
  selector: 'app-visualizar-servico',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    CardVisualizacaoComponent,
    BotaoComponent,
    BotaoAprovarComponent,
    BotaoCancelarComponent
  ],
  templateUrl: './visualizar-servico.component.html',
  styleUrl: './visualizar-servico.component.css',
})
export class VisualizarServicoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private solicitacaoService = inject(SolicitacaoService);
  private historicoService = inject(HistoricoService);

  solicitacao: Solicitacao | undefined;
  historicoOrdenado: HistoricoSolicitacao[] = [];

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) return;

    const id = Number(idParam);
    this.solicitacao = this.solicitacaoService.buscarPorId(id);

    if (this.solicitacao) {
      this.historicoOrdenado = this.historicoService.listarPorSolicitacao(this.solicitacao.id!);
    }
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

  obterIconeEstado(estado: string): string {
    switch (estado.toUpperCase()) {
      case 'ABERTA': return 'folder_open';
      case 'ORCADA': return 'request_quote';
      case 'REJEITADA': return 'cancel';
      case 'APROVADA': return 'check_circle';
      case 'REDIRECIONADA': return 'swap_horiz';
      case 'ARRUMADA': return 'build';
      case 'PAGA': return 'payments';
      case 'FINALIZADA': return 'verified';
      default: return 'info';
    }
  }

  navegarParaAcao(): void {
    if (!this.solicitacao) return;
    const estado = this.solicitacao.estadoAtual;
    const id = this.solicitacao.id;

    switch (estado) {
      case SolicitacaoENUM.ORCADA:
        this.router.navigate(['/cliente/mostrar-orcamento', id]);
        break;
      case SolicitacaoENUM.REJEITADA:
        this.resgatarServico();
        break;
      case SolicitacaoENUM.ARRUMADA:
        this.router.navigate(['/cliente/pagar', id]);
        break;
      default:
        break;
    }
  }

  resgatarServico(): void {
    if (!this.solicitacao) return;

    this.historicoService.inserir({
      dataHora: new Date().toISOString(),
      estadoAnterior: SolicitacaoENUM.REJEITADA,
      estadoNovo: SolicitacaoENUM.APROVADA,
      solicitacaoId: this.solicitacao.id!,
      observacao: 'Serviço resgatado pelo cliente.'
    });

    this.solicitacao.estadoAtual = SolicitacaoENUM.APROVADA;
    this.solicitacaoService.atualizar(this.solicitacao);

    this.historicoOrdenado = this.historicoService.listarPorSolicitacao(this.solicitacao.id!);
  }

  obterTextoBotaoAcao(): string {
    if (!this.solicitacao) return '';
    switch (this.solicitacao.estadoAtual) {
      case SolicitacaoENUM.ORCADA: return 'Aprovar/Rejeitar Serviço';
      case SolicitacaoENUM.REJEITADA: return 'Resgatar Serviço';
      case SolicitacaoENUM.ARRUMADA: return 'Pagar Serviço';
      default: return '';
    }
  }

  temAcao(): boolean {
    if (!this.solicitacao) return false;
    const estadosComAcao = [
      SolicitacaoENUM.ORCADA,
      SolicitacaoENUM.REJEITADA,
      SolicitacaoENUM.ARRUMADA,
    ];
    return estadosComAcao.includes(this.solicitacao.estadoAtual as SolicitacaoENUM);
  }

  voltar(): void {
    this.router.navigate(['/cliente']);
  }
}
