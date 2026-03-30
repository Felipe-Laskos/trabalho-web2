import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon'
import { ActivatedRoute, Router } from '@angular/router';
import { mockSolicitacao } from '../../mocks/solicitacao.mock';
import { Solicitacao } from '../../models/solicitacao.model';
import { CardVisualizacaoComponent } from '../../shared/card-visualizacao/card-visualizacao.component';
import { BotaoComponent } from '../../shared/botao/botao.component';
import { BotaoCancelarComponent } from "../../shared/botao-cancelar/botao-cancelar.component";
import { BotaoAprovarComponent } from "../../shared/botao-aprovar/botao-aprovar.component";

@Component({
  selector: 'app-pagar-servico',
  standalone: true,
  imports: [CommonModule, MatIconModule, CardVisualizacaoComponent, BotaoComponent, BotaoCancelarComponent, BotaoAprovarComponent],
  templateUrl: './pagar-servico.component.html',
  styleUrl: './pagar-servico.component.css',
})
export class PagarServicoComponent implements OnInit {
  solicitacao: Solicitacao | undefined;
  dataHoraAcesso: Date = new Date();
  dataHoraPagamento: Date | undefined;
  exibirModalConfirmacao: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) return;

    this.solicitacao = mockSolicitacao.find((s) => s.id === Number(idParam));
  }
  confirmarPagamento() {
    if (this.solicitacao?.estadoAtual === 'ARRUMADA') {
      this.exibirModalConfirmacao = true;
    } else {
      alert('Esta solicitação não está pronta para pagamento!');
    }
  }

  finalizarPagamento() {
    if (this.solicitacao) {
      this.dataHoraPagamento = new Date();
      this.solicitacao.estadoAtual = 'PAGA';
      console.log(
        'Serviço pago com sucesso em:',
        this.dataHoraPagamento.toLocaleString('pt-BR'),
      );
      this.exibirModalConfirmacao = false;
      this.router.navigate(['/cliente']);
    }
  }
  cancelar() {
    this.exibirModalConfirmacao = false;
  }
  voltar() {
    this.router.navigate(['/cliente']);
  }
  obterCorDoBadge(estado: string | undefined): string {
    if (!estado) return 'badge-cinza';

    switch (estado.toUpperCase()) {
      case 'ABERTA':
        return 'badge-cinza';
      case 'ORÇADA':
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
