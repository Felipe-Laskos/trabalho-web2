import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';


import { TabelaComponent, ColunaTabela, AcaoTabela } from '../../shared/tabela/tabela.component';
import { ComboComponent, OpcaoCombo } from '../../shared/combo/combo.component';
import { PaginacaoComponent } from '../../shared/paginacao/paginacao.component';
import { ModalGenericoComponent, ModalDados } from '../../shared/modal-generico/modal-generico.component';
import { mockSolicitacao } from '../../mocks/solicitacao.mock';
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
    PaginacaoComponent
  ],
  templateUrl: './visualizar-solicitacoes.component.html',
  styleUrl: './visualizar-solicitacoes.component.css'
})
export class VisualizarSolicitacoesComponent {

constructor(
  private router: Router,
  private authService: AuthService,
  private dialog: MatDialog,
  private funcionarioService: FuncionarioService
) {}

  opcoesFiltro: OpcaoCombo[] = [
    { value: 'TODAS', viewValue: 'Todas' },
    { value: 'HOJE', viewValue: 'Hoje' },
    { value: 'PERIODO', viewValue: 'Período' }
  ];

  filtro: 'TODAS' | 'HOJE' | 'PERIODO' = 'TODAS';
  dataInicio?: string;
  dataFim?: string;

  solicitacoes = [...mockSolicitacao];
  solicitacoesFiltradas = [...this.solicitacoes];

  colunas: ColunaTabela[] = [
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
        if (confirmado) {
          item.estadoAtual = 'FINALIZADA';
          item.dataHoraFinalizacao = new Date().toISOString();
          item.funcionarioResponsavel = this.authService.getNome();
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
      const inicio = new Date(this.dataInicio);
      const fim = new Date(this.dataFim);
      fim.setHours(23, 59, 59, 999);

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

  paginaAtual: number = 1;
  itensPorPagina: number = 4;

  get dadosPaginados() {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    return this.solicitacoesFiltradas.slice(inicio, fim);
  }

  onPaginaChange(pagina: number) {
    this.paginaAtual = pagina;
  }
}