import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Solicitacao } from '../../models/solicitacao.model';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { HistoricoService } from '../../services/historico.service';
import { SolicitacaoENUM } from '../../models/solicitacaoENUM.model';
import { CardVisualizacaoComponent } from '../../shared/card-visualizacao/card-visualizacao.component';
import { BotaoComponent } from '../../shared/botao/botao.component';
import { BotaoCancelarComponent } from "../../shared/botao-cancelar/botao-cancelar.component";
import { BotaoAprovarComponent } from "../../shared/botao-aprovar/botao-aprovar.component";

@Component({
  selector: 'app-pagar-servico',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatSnackBarModule, CardVisualizacaoComponent, BotaoComponent, BotaoCancelarComponent, BotaoAprovarComponent],
  templateUrl: './pagar-servico.component.html',
  styleUrl: './pagar-servico.component.css',
})
export class PagarServicoComponent implements OnInit {

  private solicitacaoService = inject(SolicitacaoService);
  private historicoService = inject(HistoricoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private aviso = inject(MatSnackBar);

  solicitacao: Solicitacao | undefined;
  dataHoraAcesso: Date = new Date();
  exibirModalConfirmacao: boolean = false;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) return;

    this.solicitacao = this.solicitacaoService.buscarPorId(Number(idParam));
  }

  confirmarPagamento(): void {
    if (this.solicitacao?.estadoAtual === SolicitacaoENUM.ARRUMADA) {
      this.exibirModalConfirmacao = true;
    } else {
      this.aviso.open('Esta solicitação não está pronta para pagamento!', 'OK', { duration: 3000, verticalPosition: 'top' });
    }
  }

  finalizarPagamento(): void {
    if (this.solicitacao) {
      this.historicoService.inserir({
        dataHora: new Date().toISOString(),
        estadoAnterior: this.solicitacao.estadoAtual,
        estadoNovo: SolicitacaoENUM.PAGA,
        solicitacaoId: this.solicitacao.id!,
        observacao: `Pagamento realizado. Valor: R$ ${this.solicitacao.valorOrcado?.toFixed(2)}`
      });
      this.solicitacao.estadoAtual = SolicitacaoENUM.PAGA;
      this.solicitacao.dataHoraPagamento = new Date().toISOString();
      this.solicitacaoService.atualizar(this.solicitacao);

      this.exibirModalConfirmacao = false;
      this.aviso.open('Pagamento realizado com sucesso!', 'OK', { duration: 3000, verticalPosition: 'top' });
      this.router.navigate(['/cliente']);
    }
  }

  cancelar(): void {
    this.exibirModalConfirmacao = false;
  }

  voltar(): void {
    this.router.navigate(['/cliente']);
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
