import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { TabelaComponent, ColunaTabela, AcaoTabela } from '../../shared/tabela/tabela.component';
import { ComboComponent, OpcaoCombo } from '../../shared/combo/combo.component';
import { PaginacaoComponent } from '../../shared/paginacao/paginacao.component';
import { ModalGenericoComponent, ModalDados } from '../../shared/modal-generico/modal-generico.component';
import { CardVisualizacaoComponent } from '../../shared/card-visualizacao/card-visualizacao.component';
import { Solicitacao } from '../../models/solicitacao.model';
import { SolicitacaoENUM } from '../../models/solicitacaoENUM.model';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { HistoricoService } from '../../services/historico.service';
import { AuthService } from '../../services/auth.service';
import { FuncionarioService } from '../../services/funcionario.service';

@Component({
  selector: 'app-visualizar-solicitacoes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TabelaComponent,
    ComboComponent,
    PaginacaoComponent,
    CardVisualizacaoComponent
  ],
  templateUrl: './visualizar-solicitacoes.component.html',
  styleUrl: './visualizar-solicitacoes.component.css'
})
export class VisualizarSolicitacoesComponent implements OnInit {

  private solicitacaoService = inject(SolicitacaoService);
  private historicoService = inject(HistoricoService);
  private authService = inject(AuthService);
  private funcionarioService = inject(FuncionarioService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  opcoesFiltro: OpcaoCombo[] = [
    { value: 'TODAS', viewValue: 'Todas' },
    { value: 'HOJE', viewValue: 'Hoje' },
    { value: 'PERIODO', viewValue: 'Período' }
  ];

  filtro: 'TODAS' | 'HOJE' | 'PERIODO' = 'TODAS';
  dataInicio?: string;
  dataFim?: string;

  solicitacoes: Solicitacao[] = [];
  solicitacoesFiltradas: Solicitacao[] = [];

  colunas: ColunaTabela[] = [
    { campo: 'id', titulo: 'ID', tipo: 'texto' },
    { campo: 'descricaoEquipamento', titulo: 'Equipamento', tipo: 'texto' },
    { campo: 'dataHoraCriacao', titulo: 'Data', tipo: 'data' },
    { campo: 'estadoAtual', titulo: 'Status', tipo: 'estado' },
    { campo: 'valorOrcado', titulo: 'Valor', tipo: 'texto' },
    { campo: 'acao', titulo: 'Ação', tipo: 'acao' }
  ];

  acoes: AcaoTabela[] = [
    { nome: 'Efetuar Orçamento', acao: 'orcamento', cor: 'primary', estados: ['ABERTA'] },
    { nome: 'Efetuar Manutenção', acao: 'manutencao', cor: 'accent', estados: ['APROVADA', 'REDIRECIONADA'] },
    { nome: 'Finalizar Solicitação', acao: 'finalizar', cor: 'warn', estados: ['PAGA'] }
  ];

  paginaAtual: number = 1;
  itensPorPagina: number = 4;

  ngOnInit(): void {
    this.carregarSolicitacoes();
    this.aplicarFiltros();
  }

  private carregarSolicitacoes(): void {
    this.solicitacoes = this.solicitacaoService.listarTodos();
  }

  getFuncionarioLogadoId(): number | undefined {
    const email = this.authService.getEmail();
    const funcionario = this.funcionarioService.buscarPorEmail(email);
    return funcionario?.id;
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
          textoCancelar: 'Cancelar'
        };

        const dialogRef = this.dialog.open(ModalGenericoComponent, {
          data: modalData,
          width: '400px'
        });

        dialogRef.afterClosed().subscribe(confirmado => {
          if (confirmado && item) {
            const funcionarioLogado = this.funcionarioService.buscarPorEmail(this.authService.getEmail());

            this.historicoService.inserir({
              dataHora: new Date().toISOString(),
              estadoAnterior: item.estadoAtual,
              estadoNovo: SolicitacaoENUM.FINALIZADA,
              solicitacaoId: item.id!,
              funcionario: funcionarioLogado,
              observacao: 'Solicitação finalizada pelo funcionário.'
            });

            item.estadoAtual = SolicitacaoENUM.FINALIZADA;
            item.dataHoraFinalizacao = new Date().toISOString();
            item.funcionarioResponsavel = {
              id: funcionarioLogado?.id,
              nome: this.authService.getNome()
            };

            this.solicitacaoService.atualizar(item);
            this.carregarSolicitacoes();
            this.aplicarFiltros();
          }
        });
        break;
    }
  }

  onFiltroChange(valor: string | number) {
    this.filtro = valor as 'TODAS' | 'HOJE' | 'PERIODO';

    if (this.filtro !== 'PERIODO') {
      this.dataInicio = undefined;
      this.dataFim = undefined;
    }

    this.aplicarFiltros();
  }

  aplicarFiltros() {
    const funcionarioLogadoId = this.getFuncionarioLogadoId();
    let lista = [...this.solicitacoes];
    const hoje = new Date();

    lista = lista.filter(s => {
      if (s.estadoAtual === 'REDIRECIONADA') {
        return s.funcionarioResponsavel?.id === funcionarioLogadoId;
      }
      return true;
    });

    if (this.filtro === 'HOJE') {
      lista = lista.filter(s => {
        const data = new Date(s.dataHoraCriacao);
        return data.toDateString() === hoje.toDateString();
      });
    }

    if (this.filtro === 'PERIODO' && this.dataInicio && this.dataFim) {
      const [anoI, mesI, diaI] = this.dataInicio.split('-').map(Number);
      const [anoF, mesF, diaF] = this.dataFim.split('-').map(Number);

      const inicio = new Date(anoI, mesI - 1, diaI, 0, 0, 0, 0);
      const fim = new Date(anoF, mesF - 1, diaF, 23, 59, 59, 999);

      lista = lista.filter(s => {
        const data = new Date(s.dataHoraCriacao);
        return data >= inicio && data <= fim;
      });
    }

    lista.sort((a, b) => {
      return new Date(a.dataHoraCriacao).getTime() - new Date(b.dataHoraCriacao).getTime();
    });

    this.solicitacoesFiltradas = lista;
    this.paginaAtual = 1;
  }

  get dadosPaginados() {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    return this.solicitacoesFiltradas.slice(inicio, fim);
  }

  onPaginaChange(pagina: number) {
    this.paginaAtual = pagina;
  }
}
