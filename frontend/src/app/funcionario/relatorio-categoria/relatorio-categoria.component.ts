import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Solicitacao } from '../../core/models/solicitacao.model';
import { SolicitacaoService } from '../../core/services/solicitacao.service';
import { SolicitacaoENUM } from '../../core/models/solicitacaoENUM.model';
import { CardVisualizacaoComponent } from '../../shared/card-visualizacao/card-visualizacao.component';
import { BotaoComponent } from '../../shared/botao/botao.component';
import { InputComponent } from '../../shared/input/input.component';
import { TabelaComponent, ColunaTabela } from '../../shared/tabela/tabela.component';
import { CardInfoComponent } from '../../shared/card-info/card-info.component';
import { PaginacaoComponent } from '../../shared/paginacao/paginacao.component';
import { MatIcon } from '@angular/material/icon';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ReceitaDia {
  data: string;
  quantidade: number;
  total: number;
}

@Component({
  selector: 'app-relatorio-categoria',
  standalone: true,
  imports: [
    CommonModule,
    CardVisualizacaoComponent,
    BotaoComponent,
    InputComponent,
    TabelaComponent,
    CardInfoComponent,
    PaginacaoComponent,
    MatIcon
  ],
  templateUrl: './relatorio-categoria.component.html',
  styleUrl: './relatorio-categoria.component.css'
})
export class RelatorioCategoriasComponent implements OnInit {

  private solicitacaoService = inject(SolicitacaoService);

  categoria: string = '';
  receitasPorCategoria: any[] = [];
  totalGeral: number = 0;
  quantidadeTotal: number = 0;
  paginaAtual: number = 1;
  itensPorPagina: number = 5;

  colunasTabela: ColunaTabela[] = [
    { campo: 'categoria', titulo: 'Categoria', tipo: 'texto' },
    { campo: 'quantidade', titulo: 'Qtd. Serviços', tipo: 'texto' },
    { campo: 'totalFormatado', titulo: 'Receita do Dia', tipo: 'texto' }
  ];

  get dadosPaginados(): any[] {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    return this.receitasPorCategoria.slice(inicio, inicio + this.itensPorPagina);
  }

  onPaginaMudou(pagina: number): void {
    this.paginaAtual = pagina;
  }

  ngOnInit(): void {
    this.filtrar();
  }

  onCategoriaMudou(valor: string): void {
    this.categoria = valor;
  }

  filtrar(): void {
  this.paginaAtual = 1;
  

  //ALTEREI A PARTIR DAQUI - TODO O CÓDIGO DE FILTRAGEM, AGRUPAMENTO E TRANSFORMAÇÃO FICOU DENTRO DO "next" DA INSCRIÇÃO DO SERVICE E ACEITA OBSERVABLE

  this.solicitacaoService.listarTodos().subscribe({
      next: (solicitacoes: Solicitacao[]) => {
        
        let pagas = solicitacoes.filter((s: Solicitacao) =>
          s.estadoAtual === SolicitacaoENUM.PAGA ||
          s.estadoAtual === SolicitacaoENUM.FINALIZADA
        );

        if (this.categoria) {
          pagas = pagas.filter((s: Solicitacao) => 
            s.categoriaEquipamento?.nome.toLowerCase().includes(this.categoria.toLowerCase())
          );
        }
        
        const agrupado: Record<string, { quantidade: number; total: number }> = {};

        pagas.forEach((s: Solicitacao) => {
          const nomeCategoria = s.categoriaEquipamento?.nome || 'Sem Categoria';

          if (!agrupado[nomeCategoria]) {
            agrupado[nomeCategoria] = { quantidade: 0, total: 0 };
          }

          agrupado[nomeCategoria].quantidade++;
          agrupado[nomeCategoria].total += s.valorOrcado || 0;
        });
        this.receitasPorCategoria = Object.keys(agrupado).map(nomeCategoria => ({
          categoria: nomeCategoria,
          quantidade: agrupado[nomeCategoria].quantidade,
          total: agrupado[nomeCategoria].total,
          totalFormatado: agrupado[nomeCategoria].total.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          })
        }));
        this.totalGeral = this.receitasPorCategoria.reduce((acc, r) => acc + r.total, 0);
        this.quantidadeTotal = this.receitasPorCategoria.reduce((acc, r) => acc + r.quantidade, 0);
      },
      error: (err) => {
        console.error('Erro ao carregar relatório de categorias:', err);
      }
    });
  }

  gerarPdf(): void {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Relatório de Receita por Categoria', 14, 15);

    doc.setFontSize(10);
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    doc.text(`Gerado em: ${dataAtual}`, 14, 22);

    const colunas = ['Categoria', 'Qtd. Serviços', 'Receita'];
    const linhas = this.receitasPorCategoria.map(r => [
      r.categoria,
      r.quantidade.toString(),
      r.totalFormatado
    ]);

    autoTable(doc, {
      startY: 30,
      head: [colunas],
      body: linhas,
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.setFontSize(12);
    doc.text(`Total de Serviços: ${this.quantidadeTotal}`, 14, finalY);
    doc.text(`Total Geral: ${this.formatarMoeda(this.totalGeral)}`, 14, finalY + 7);

    doc.save('relatorio-categorias.pdf');
  }

  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
