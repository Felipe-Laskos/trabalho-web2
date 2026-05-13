import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Solicitacao } from '../../core/models/solicitacao.model';
import { SolicitacaoService } from '../../core/services/solicitacao.service';
import { SolicitacaoENUM } from '../../core/models/solicitacaoENUM.model';
import { CardVisualizacaoComponent } from '../../shared/card-visualizacao/card-visualizacao.component';
import { BotaoComponent } from '../../shared/botao/botao.component';
import { InputComponent } from '../../shared/input/input.component';
import {
  TabelaComponent,
  ColunaTabela,
} from '../../shared/tabela/tabela.component';
import { CardInfoComponent } from '../../shared/card-info/card-info.component';
import { PaginacaoComponent } from '../../shared/paginacao/paginacao.component';
import { MatIcon } from '@angular/material/icon';
import { NotificationService } from '../../core/services/notification.service';

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
    PaginacaoComponent,
    MatIcon,
  ],
  templateUrl: './relatorio-receitas.component.html',
  styleUrl: './relatorio-receitas.component.css',
})
export class RelatorioReceitasComponent implements OnInit {
  private solicitacaoService = inject(SolicitacaoService);
  private notificationService = inject(NotificationService);
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
    { campo: 'totalFormatado', titulo: 'Receita do Dia', tipo: 'texto' },
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

    if (!this.dataInicio || !this.dataFim) {
      return;
    }

    this.paginaAtual = 1;

    this.solicitacaoService
      .buscarReceitasPeriodo(this.dataInicio, this.dataFim)
      .subscribe({

        next: (dados) => {

          this.receitasPorDia = dados.map((item: any) => ({

            data: new Date(item.data)
              .toLocaleDateString('pt-BR'),

            quantidade: item.quantidade,

            total: item.total,

            totalFormatado: item.total.toLocaleString(
              'pt-BR',
              {
                style: 'currency',
                currency: 'BRL'
              }
            )
          }));

          this.totalGeral =
            this.receitasPorDia.reduce(
              (acc, r) => acc + r.total,
              0
            );

          this.quantidadeTotal =
            this.receitasPorDia.reduce(
              (acc, r) => acc + r.quantidade,
              0
            );
        },

        error: (erro) => {
          this.notificationService.exibirErro(erro);
        }
      });
  }

  gerarPdf(): void {

    this.solicitacaoService
      .gerarRelatorioPeriodoPdf(this.dataInicio, this.dataFim)
      .subscribe({

        next: (blob: Blob) => {

          const url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');

          a.href = url;

          a.download = 'relatorio-periodo.pdf';

          a.click();

          window.URL.revokeObjectURL(url);
        },

        error: (erro) => {
          this.notificationService.exibirErro(erro);
        }
      });
  }

  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }
}
