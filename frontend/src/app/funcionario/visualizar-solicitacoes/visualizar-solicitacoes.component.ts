import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {
  TabelaComponent,
  ColunaTabela,
  AcaoTabela,
} from '../../shared/tabela/tabela.component';
import { ComboComponent, OpcaoCombo } from '../../shared/combo/combo.component';
import { PaginacaoComponent } from '../../shared/paginacao/paginacao.component';
import {
  ModalGenericoComponent,
  ModalDados,
} from '../../shared/modal-generico/modal-generico.component';
import { CardVisualizacaoComponent } from '../../shared/card-visualizacao/card-visualizacao.component';
import { Solicitacao } from '../../core/models/solicitacao.model';
import { SolicitacaoENUM } from '../../core/models/solicitacaoENUM.model';
import { SolicitacaoService } from '../../core/services/solicitacao.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-visualizar-solicitacoes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TabelaComponent,
    ComboComponent,
    PaginacaoComponent,
    CardVisualizacaoComponent,
  ],
  templateUrl: './visualizar-solicitacoes.component.html',
  styleUrl: './visualizar-solicitacoes.component.css',
})
export class VisualizarSolicitacoesComponent implements OnInit {
  private solicitacaoService = inject(SolicitacaoService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  opcoesFiltro: OpcaoCombo[] = [
    { value: 'TODAS', viewValue: 'Todas' },
    { value: 'HOJE', viewValue: 'Hoje' },
    { value: 'PERIODO', viewValue: 'Período' },
  ];

  filtro: 'TODAS' | 'HOJE' | 'PERIODO' = 'TODAS';
  dataInicio?: string;
  dataFim?: string;

  solicitacoesFiltradas: Solicitacao[] = [];

  colunas: ColunaTabela[] = [
    { campo: 'id', titulo: 'ID', tipo: 'texto' },
    {
      campo: 'descricaoEquipamento',
      titulo: 'Equipamento',
      tipo: 'texto',
      truncar: 30,
    },
    { campo: 'dataHoraCriacao', titulo: 'Data', tipo: 'data' },
    { campo: 'estadoAtual', titulo: 'Status', tipo: 'estado' },
    { campo: 'valorOrcado', titulo: 'Valor', tipo: 'texto' },
    { campo: 'acao', titulo: 'Ação', tipo: 'acao' },
  ];

  acoes: AcaoTabela[] = [
    {
      nome: 'Efetuar Orçamento',
      acao: 'orcamento',
      cor: 'primary',
      estados: [SolicitacaoENUM.ABERTA],
    },
    {
      nome: 'Efetuar Manutenção',
      acao: 'manutencao',
      cor: 'accent',
      estados: [SolicitacaoENUM.APROVADA, SolicitacaoENUM.REDIRECIONADA],
    },
    {
      nome: 'Finalizar Solicitação',
      acao: 'finalizar',
      cor: 'warn',
      estados: [SolicitacaoENUM.PAGA],
    },
  ];

  paginaAtual: number = 0;
  itensPorPagina: number = 4;
  totalItens: number = 0;

  ngOnInit(): void {
    this.carregarSolicitacoes();
  }

  carregarSolicitacoes(): void {

    this.solicitacaoService
      .listarComFiltros(
        this.filtro,
        this.paginaAtual,
        this.itensPorPagina,
        this.dataInicio,
        this.dataFim
      )
      .subscribe({

        next: (pagina) => {

          this.solicitacoesFiltradas = pagina.content;

          this.totalItens = pagina.totalElements;
        },

        error: (erro) => {

          this.dialog.open(ModalGenericoComponent, {
            data: {
              titulo: 'Erro',
              mensagem:
                erro?.error?.message ||
                'Não foi possível carregar as solicitações.',
              textoConfirmar: 'OK',
              textoCancelar: ''
            }
          });
        }
      });
  }
  getFuncionarioLogadoId(): number | undefined {
    return this.authService.getId();
  }

  onAcaoTabela(event: any) {
    const { acao, item } = event;

    switch (acao) {
      case 'orcamento':
        this.router.navigate(['/funcionario/efetuar-orcamento', item.id]);
        break;

      case 'manutencao':
        this.router.navigate(['/funcionario/efetuar-manutencao', item.id]);
        break;

      case 'finalizar':
        const modalData: ModalDados = {
          tipo: 'confirmacao',
          titulo: 'Finalizar Solicitação',
          mensagem: 'Deseja realmente finalizar esta solicitação?',
          textoConfirmar: 'Finalizar',
          textoCancelar: 'Cancelar',
        };

        const dialogRef = this.dialog.open(ModalGenericoComponent, {
          data: modalData,
          width: '400px',
        });

        dialogRef.afterClosed().subscribe((confirmado) => {
          if (confirmado && item) {


            this.solicitacaoService.finalizar(item.id!).subscribe({
              next: (solicitacaoAtualizada) => {
                item.estadoAtual = solicitacaoAtualizada.estadoAtual;
                item.dataHoraFinalizacao = solicitacaoAtualizada.dataHoraFinalizacao;
                item.funcionarioResponsavel = solicitacaoAtualizada.funcionarioResponsavel;
                this.carregarSolicitacoes();
              },
              error: (erro) => {
                console.error('Erro ao finalizar solicitação', erro);
              }
            });
          }
        });
        break;
    }
  }

  onFiltroChange(valor: string | number) {

    this.filtro = valor as 'TODAS' | 'HOJE' | 'PERIODO';
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {

    this.paginaAtual = 0;

    this.carregarSolicitacoes();
  }

  onPaginaChange(pagina: number) {

    this.paginaAtual = pagina - 1;

    this.carregarSolicitacoes();
  }
}
