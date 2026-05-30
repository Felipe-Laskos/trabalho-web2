import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Solicitacao } from '../../core/models/solicitacao.model';
import { SolicitacaoService } from '../../core/services/solicitacao.service';
import { SolicitacaoENUM } from '../../core/models/solicitacaoENUM.model';
import { CardVisualizacaoComponent } from '../../shared/card-visualizacao/card-visualizacao.component';
import { BotaoComponent } from '../../shared/botao/botao.component';
import { NotificationService } from '../../core/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalGenericoComponent } from '../../shared/modal-generico/modal-generico.component';

@Component({
  selector: 'app-pagar-servico',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatSnackBarModule,
    CardVisualizacaoComponent,
    BotaoComponent,
  ],
  templateUrl: './pagar-servico.component.html',
  styleUrl: './pagar-servico.component.css',
})
export class PagarServicoComponent implements OnInit {
  private solicitacaoService = inject(SolicitacaoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private aviso = inject(MatSnackBar);
  private notificationService = inject(NotificationService);
  private dialog = inject(MatDialog);
  solicitacao: Solicitacao | undefined;
  dataHoraAcesso: Date = new Date();

  exibirModalConfirmacao: boolean = false;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) return;

    this.solicitacaoService
      .buscarPorId(Number(idParam))
      .subscribe((solicitacao) => {
        this.solicitacao = solicitacao;
      });
  }

    confirmarPagamento(): void {
    if (this.solicitacao?.estadoAtual === SolicitacaoENUM.ARRUMADA) {
      
      const valorFormatado = new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
      }).format(this.solicitacao.valorOrcado || 0);

      const dialogRef = this.dialog.open(ModalGenericoComponent, {
        width: '400px',
        data: {
          tipo: 'confirmacao',
          titulo: 'Confirmar Pagamento?',
          mensagem: `<p>O serviço ficou no valor de:</p> <div class="valor-confirmacao" style="font-size: 1.5rem; font-weight: bold; margin-top: 10px;">${valorFormatado}</div>`,
          textoConfirmar: 'Sim, Confirmar',
          textoCancelar: 'Não, Voltar'
        }
      });
      dialogRef.afterClosed().subscribe(resultado => {
        if (resultado === true) {
          this.finalizarPagamento();
        }
      });

    } else {
      this.aviso.open('O serviço ainda não está pronto para pagamento.', 'OK', {
        duration: 3000,
        verticalPosition: 'top',
      });
    }
  }

    finalizarPagamento(): void {
    if (this.solicitacao && this.solicitacao.id) {
      const idSeguro = this.solicitacao.id;

      this.solicitacaoService.pagar(this.solicitacao.id).subscribe({ 
        next: () => {
          this.exibirModalConfirmacao = false;

          this.aviso.open('Pagamento realizado com sucesso!', 'OK', {
            duration: 3000,
            verticalPosition: 'top',
          });
          this.router.navigate(['/cliente/visualizar-servico', idSeguro]); 
        },
        error: (err) => {
          this.notificationService.exibirErro(err);
        },
      });
    }
  }

  formatarData(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');

    return `${ano}-${mes}-${dia} ${horas}:${minutos}`;
  }

  voltar(): void {
    this.router.navigate(['/cliente']);
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
