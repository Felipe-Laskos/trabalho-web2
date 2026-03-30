import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Solicitacao } from '../../models/solicitacao.model';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { SolicitacaoENUM } from '../../models/solicitacaoENUM.model';
import { CardVisualizacaoComponent } from '../../shared/card-visualizacao/card-visualizacao.component';
import { BotaoComponent } from '../../shared/botao/botao.component';
import { InputComponent } from '../../shared/input/input.component';
import { TabelaComponent, ColunaTabela } from '../../shared/tabela/tabela.component';
import { CardInfoComponent } from '../../shared/card-info/card-info.component';
import { PaginacaoComponent } from '../../shared/paginacao/paginacao.component';

export interface ReceitaDia {
  data: string;
  quantidade: number;
  total: number;
}

@Component({
  selector: 'app-relatorio-receitas',
  standalone: true,
  imports: [
    CommonModule,
    CardVisualizacaoComponent,
    BotaoComponent,
    InputComponent,
    TabelaComponent,
    CardInfoComponent,
    PaginacaoComponent
  ],
  templateUrl: './relatorio-receitas.component.html',
  styleUrl: './relatorio-receitas.component.css'
})
export class RelatorioReceitasComponent implements OnInit {

  private solicitacaoService = inject(SolicitacaoService);

  dataInicio: string = '';
  dataFim: string = '';
  receitasPorDia: any[] = [];
  totalGeral: number = 0;
  quantidadeTotal: number = 0;
  paginaAtual: number = 1;
  itensPorPagina: number = 5;

  colunasTabela: ColunaTabela[] = [
    { campo: 'data', titulo: 'Data', tipo: 'texto' },
    { campo: 'quantidade', titulo: 'Qtd. Serviços', tipo: 'texto' },
    { campo: 'totalFormatado', titulo: 'Receita do Dia', tipo: 'texto' }
  ];

  get dadosPaginados(): any[] {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    return this.receitasPorDia.slice(inicio, inicio + this.itensPorPagina);
  }

  onPaginaMudou(pagina: number): void {
    this.paginaAtual = pagina;
  }

  ngOnInit(): void {
    this.filtrar();
  }

  onDataInicioMudou(valor: string): void {
    this.dataInicio = valor;
  }

  onDataFimMudou(valor: string): void {
    this.dataFim = valor;
  }

  filtrar(): void {
    this.paginaAtual = 1;
    const solicitacoes = this.solicitacaoService.listarTodos();

    let pagas = solicitacoes.filter(s =>
      s.estadoAtual === SolicitacaoENUM.PAGA ||
      s.estadoAtual === SolicitacaoENUM.FINALIZADA
    );

    if (this.dataInicio) {
      const [ano, mes, dia] = this.dataInicio.split('-').map(Number);
      const inicio = new Date(ano, mes - 1, dia, 0, 0, 0, 0);
      pagas = pagas.filter(s => {
        const data = new Date(s.dataHoraPagamento || s.dataHoraCriacao);
        return data >= inicio;
      });
    }

    if (this.dataFim) {
      const [ano, mes, dia] = this.dataFim.split('-').map(Number);
      const fim = new Date(ano, mes - 1, dia, 23, 59, 59, 999);
      pagas = pagas.filter(s => {
        const data = new Date(s.dataHoraPagamento || s.dataHoraCriacao);
        return data <= fim;
      });
    }

    const agrupado: Record<string, { quantidade: number; total: number }> = {};

    pagas.forEach(s => {
      const dataStr = s.dataHoraPagamento || s.dataHoraCriacao;
      const dia = new Date(dataStr).toLocaleDateString('pt-BR');

      if (!agrupado[dia]) {
        agrupado[dia] = { quantidade: 0, total: 0 };
      }
      agrupado[dia].quantidade++;
      agrupado[dia].total += s.valorOrcado || 0;
    });

    this.receitasPorDia = Object.keys(agrupado)
      .sort((a, b) => {
        const [dA, mA, yA] = a.split('/').map(Number);
        const [dB, mB, yB] = b.split('/').map(Number);
        return new Date(yA, mA - 1, dA).getTime() - new Date(yB, mB - 1, dB).getTime();
      })
      .map(dia => ({
        data: dia,
        quantidade: agrupado[dia].quantidade,
        total: agrupado[dia].total,
        totalFormatado: agrupado[dia].total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      }));

    this.totalGeral = this.receitasPorDia.reduce((acc, r) => acc + r.total, 0);
    this.quantidadeTotal = this.receitasPorDia.reduce((acc, r) => acc + r.quantidade, 0);
  }

  gerarPdf(): void {
    alert('Funcionalidade de gerar PDF será implementada na integração com o backend.');
  }

  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
