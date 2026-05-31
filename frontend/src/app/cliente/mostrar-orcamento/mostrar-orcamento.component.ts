import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Solicitacao } from '../../core/models/solicitacao.model';
import { Funcionario } from '../../core/models/funcionario.model';
import { Cliente } from '../../core/models/cliente.model';
import { SolicitacaoService } from '../../core/services/solicitacao.service';
import { SolicitacaoENUM } from '../../core/models/solicitacaoENUM.model';
import { CardVisualizacaoComponent } from '../../shared/card-visualizacao/card-visualizacao.component';
import { BotaoCancelarComponent } from '../../shared/botao-cancelar/botao-cancelar.component';
import { BotaoAprovarComponent } from '../../shared/botao-aprovar/botao-aprovar.component';
import { NotificationService } from '../../core/services/notification.service';
import { TelefonePipe } from '../../shared/pipes/telefone.pipe';
import { MatDialog } from '@angular/material/dialog';
import { ModalGenericoComponent } from '../../shared/modal-generico/modal-generico.component';

@Component({
  selector: 'app-mostrar-orcamento',
  standalone: true,
  imports: [
    CommonModule,
    CardVisualizacaoComponent,
    BotaoCancelarComponent,
    BotaoAprovarComponent,
    FormsModule,
    TelefonePipe
  ],
  templateUrl: './mostrar-orcamento.component.html',
  styleUrl: './mostrar-orcamento.component.css',
})
export class MostrarOrcamentoComponent implements OnInit {
  
  private solicitacaoService = inject(SolicitacaoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient); 
  private notificationService = inject(NotificationService);
  private dialog = inject(MatDialog);
  
  solicitacao: Solicitacao | undefined;
  cliente: Cliente | undefined;
  funcionario: Funcionario | undefined;
  dataHoraAcesso: Date = new Date();

  carregamento = false;
  motivoRejeicao: string = '';
  exibirDefeitoCompleto: boolean = false;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) return;

    const id = Number(idParam);
    this.carregamento = true;

    this.solicitacaoService.buscarPorId(id).subscribe({
      next: (dadosSolicitacao: Solicitacao) => {
        this.solicitacao = dadosSolicitacao;
        
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
      },
      error: (erro: HttpErrorResponse) => {
        this.notificationService.exibirErro(erro);
        this.carregamento = false;
      },
      complete: () => {
        this.carregamento = false;
      }
    });
  }

  alternarLeiaMais(): void {
    this.exibirDefeitoCompleto = !this.exibirDefeitoCompleto;
  }

  aprovarServico(): void {
    const dialogRef = this.dialog.open(
      ModalGenericoComponent,
      {
        width: '500px',
        data: {
          tipo: 'confirmacao',
          titulo: 'Confirmar Aprovação?',
          mensagem: 'Ao confirmar, o serviço será agendado.',
          textoConfirmar: 'Sim, Confirmar',
          textoCancelar: 'Cancelar'
        }
      }
    );

    dialogRef.afterClosed().subscribe((confirmou) => {
      if (confirmou) {
        this.confirmarAprovacao();
      }
    });
  }

  confirmarAprovacao(): void {
    if (this.solicitacao && this.solicitacao.id) {
      this.carregamento = true;
      
      this.solicitacaoService.aprovar(this.solicitacao.id).subscribe({
        next: () => {
          if (this.solicitacao) {
             this.solicitacao.estadoAtual = SolicitacaoENUM.APROVADA;
          }
          this.notificationService.exibirSucesso('Serviço aprovado com sucesso!');
          this.router.navigate(['/cliente']);
        },
        error: (erro: HttpErrorResponse) => {
          this.notificationService.exibirErro(erro);
          this.carregamento = false;
        },
        complete: () => {
          this.carregamento = false;
        }
      });
    }
  }

  clickCancelar(): void {
    const dialogRef = this.dialog.open(
      ModalGenericoComponent,
      {
        width: '500px',
        data: { 
          tipo: 'confirmacao',
          titulo: 'Cancelar Serviço?', 
          mensagem:'Tem certeza de que deseja cancelar este orçamento?', 
          textoConfirmar: 'Sim, Cancelar', 
          textoCancelar: 'Não, vou pensar melhor' 
        }
      }
    );

    dialogRef.afterClosed().subscribe((confirmou) => {
      if (confirmou) {
        this.abrirModalMotivoRejeicao();
      }
    });
  }

  abrirModalMotivoRejeicao(): void {
    const dialogRef = this.dialog.open(
      ModalGenericoComponent,
      {
        width: '600px',
        data: {
          tipo: 'formulario',
          titulo: 'Motivo do Cancelamento',
          textoConfirmar: 'Confirmar Motivo',
          textoCancelar: 'Cancelar',
          campos: [
            { 
              label:'Por favor, escreva abaixo o motivo de estar cancelando o serviço:', 
              campo: 'motivo', 
              obrigatorio: true 
            }
          ]
        }
      }
    );

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado?.motivo) {
        this.motivoRejeicao = resultado.motivo;
        this.finalizarRejeicao();
      }
    });
  }

  finalizarRejeicao(): void {
    if (this.solicitacao && this.solicitacao.id) {
      this.carregamento = true;
      
      this.solicitacaoService.rejeitar(this.solicitacao.id, this.motivoRejeicao).subscribe({
        next: () => {
          if (this.solicitacao) {
            this.solicitacao.estadoAtual = SolicitacaoENUM.REJEITADA;
            this.solicitacao.motivoRejeicao = this.motivoRejeicao;
          }
          this.notificationService.exibirSucesso('Serviço rejeitado com sucesso!');
          this.router.navigate(['/cliente']);
        },
        error: (erro: HttpErrorResponse) => {
          this.notificationService.exibirErro(erro);
          this.carregamento = false;
        },
        complete: () => {
          this.carregamento = false;
        }
      });
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
}