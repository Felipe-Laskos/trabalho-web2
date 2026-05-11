import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { first, firstValueFrom } from 'rxjs'; 
import { HttpClient } from '@angular/common/http';
import { Solicitacao } from '../../core/models/solicitacao.model';
import { Funcionario } from '../../core/models/funcionario.model';
import { Cliente } from '../../core/models/cliente.model';
import { SolicitacaoService } from '../../core/services/solicitacao.service';
import { SolicitacaoENUM } from '../../core/models/solicitacaoENUM.model';
import { CardVisualizacaoComponent } from '../../shared/card-visualizacao/card-visualizacao.component';
import { BotaoCancelarComponent } from '../../shared/botao-cancelar/botao-cancelar.component';
import { BotaoAprovarComponent } from '../../shared/botao-aprovar/botao-aprovar.component';
import { TextAreaComponent } from '../../shared/text-area/text-area.component';
import { BotaoComponent } from '../../shared/botao/botao.component';

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
    BotaoComponent,
  ],
  templateUrl: './mostrar-orcamento.component.html',
  styleUrl: './mostrar-orcamento.component.css',
})
export class MostrarOrcamentoComponent implements OnInit {
  
  private solicitacaoService = inject(SolicitacaoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  
  solicitacao: Solicitacao | undefined;
  cliente: Cliente | undefined;
  funcionario: Funcionario | undefined;
  dataHoraAcesso: Date = new Date();

  exibirModal: boolean = false;
  estadoModal:
    | 'confirmacao'
    | 'sucesso'
    | 'confirmarRejeicao'
    | 'motivoRejeicao'
    | 'sucessoRejeicao' = 'confirmacao';
  motivoRejeicao: string = '';
  exibirDefeitoCompleto: boolean = false;

  async ngOnInit(): Promise<void> {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) return;

    const id = Number(idParam);

    try {
      this.solicitacao = await firstValueFrom(
        this.solicitacaoService.buscarPorId(id),
      );

      if (this.solicitacao) {
        const estado = this.solicitacao.estadoAtual?.toUpperCase();

        if (estado === 'ARRUMADA') {
          this.router.navigate(['/cliente/pagar', id]);
          return;
        }

        const estadosBloqueados = [
          'PAGA',
          'APROVADA',
          'REJEITADA',
          'FINALIZADA',
        ];

        if (estado && estadosBloqueados.includes(estado)) {
          this.router.navigate(['/cliente']);
          return;
        }

        this.cliente = this.solicitacao.cliente;
        this.funcionario = this.solicitacao.funcionarioResponsavel;
      }
    } catch (erro) {
      //TODO: Adicionar alert customizado 
    }
  }

  alternarLeiaMais(): void {
    this.exibirDefeitoCompleto = !this.exibirDefeitoCompleto;
  }

  aprovarServico(): void {
    this.estadoModal = 'confirmacao';
    this.exibirModal = true;
  }

  async confirmarAprovacao(): Promise<void> {
    if (this.solicitacao && this.solicitacao.id) {
      try {
        await firstValueFrom(
          this.solicitacaoService.aprovar(this.solicitacao.id) ,
        );

        this.solicitacao.estadoAtual = SolicitacaoENUM.APROVADA;
        this.estadoModal = 'sucesso';
      } catch (erro) {
        //TODO: Adicionar alert customizado
      }
    }
  }

  clickCancelar(): void {
    this.abrirModalRejeicao();
  }

  abrirModalRejeicao(): void {
    this.motivoRejeicao = '';
    this.estadoModal = 'confirmarRejeicao';
    this.exibirModal = true;
  }

  irParaMotivoRejeicao(): void {
    this.estadoModal = 'motivoRejeicao';
  }

  async finalizarRejeicao(): Promise<void> {
    if (this.solicitacao && this.solicitacao.id) {
      try {
        await firstValueFrom(
           this.solicitacaoService.rejeitar(
            this.solicitacao.id,
            this.motivoRejeicao,
          )
        );

        this.solicitacao.estadoAtual = SolicitacaoENUM.REJEITADA;
        this.solicitacao.motivoRejeicao = this.motivoRejeicao;
        this.estadoModal = 'sucessoRejeicao';
      } catch (erro) {
        //TODO: Adicionar alert customizado
      }
    }
  }

  fecharERedirecionar(): void {
    this.exibirModal = false;
    this.estadoModal = 'confirmacao';
    this.router.navigate(['/cliente']);
  }

  fecharModal(): void {
    this.exibirModal = false;
    this.estadoModal = 'confirmacao';
    this.motivoRejeicao = '';
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
