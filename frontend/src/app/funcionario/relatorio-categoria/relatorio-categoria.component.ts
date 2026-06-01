import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardVisualizacaoComponent } from '../../shared/card-visualizacao/card-visualizacao.component';
import { BotaoComponent } from '../../shared/botao/botao.component';
import { InputComponent } from '../../shared/input/input.component';
import { TabelaComponent, ColunaTabela } from '../../shared/tabela/tabela.component';
import { CardInfoComponent } from '../../shared/card-info/card-info.component';
import { PaginacaoComponent } from '../../shared/paginacao/paginacao.component';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from '../../core/services/notification.service';
import { CategoriaService } from '../../core/services/categoria.service';

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
    MatIconModule
  ],
  templateUrl: './relatorio-categoria.component.html',
  styleUrls: ['./relatorio-categoria.component.css']
})
export class RelatorioCategoriasComponent implements OnInit {
  private notificationService = inject(NotificationService);
  private categoriaService = inject(CategoriaService);

  categoria: string = '';
  receitasPorCategoria: any[] = [];
  totalGeral: number = 0;
  quantidadeTotal: number = 0;
  paginaAtual: number = 0;
  itensPorPagina: number = 5;
  totalElements: number = 0;
  totalPaginas: number = 0;

  colunasTabela: ColunaTabela[] = [
    { campo: 'categoria', titulo: 'Categoria', tipo: 'texto' },
    { campo: 'quantidade', titulo: 'Qtd. Serviços', tipo: 'texto' },
    { campo: 'totalFormatado', titulo: 'Receita do Dia', tipo: 'texto' }
  ];

  get dadosPaginados(): any[] {
    return this.receitasPorCategoria;
  }

  onPaginaMudou(pagina: number): void {
    this.paginaAtual = pagina;
    this.filtrar(false);
  }

  ngOnInit(): void {
    this.filtrar();
  }

  onCategoriaMudou(valor: string): void {
    this.categoria = valor;
    this.filtrar(true);
  }

  filtrar(resetarPagina = true): void {
    if (resetarPagina) {
      this.paginaAtual = 0;
    }

    this.categoriaService.getReceitasCategoria(
      this.paginaAtual,
      this.itensPorPagina,
      this.categoria
    ).subscribe({

       next: (response: any) => {
        this.receitasPorCategoria =
          response.content.map((r: any) => ({
            categoria: r.nome,
            quantidade: r.quantidade ?? 0,
            total: r.total,
            totalFormatado: Number(r.total).toLocaleString(
              'pt-BR',
              {
                style: 'currency',
                currency: 'BRL'
              }
            )
          }));

        this.totalGeral =
          this.receitasPorCategoria
            .reduce((acc, r) => acc + r.total, 0);
        this.quantidadeTotal =
          this.receitasPorCategoria
            .reduce((acc, r) => acc + r.quantidade, 0);
        this.totalElements = response.totalElements;
        this.totalPaginas = response.totalPages;
        this.paginaAtual = response.number;
      },

      error: (err) => {
        this.notificationService.exibirErro(err);
      }
    });
  }

  gerarPdf(): void {
    this.categoriaService
      .baixarRelatorioPdf(this.categoria)
      .subscribe({

        next: (pdf: Blob) => {
          const blob = new Blob(
            [pdf],
            { type: 'application/pdf' }
          );
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');

          a.href = url;
          a.download = 'relatorio-categorias.pdf';

          a.click();

          window.URL.revokeObjectURL(url);
        },

        error: (err) => {
          this.notificationService.exibirErro(err);
        }
      });
  }

  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
