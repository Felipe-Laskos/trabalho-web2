import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-paginacao',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './paginacao.component.html',
  styleUrls: ['./paginacao.component.css']
})
export class PaginacaoComponent implements OnChanges {


  @Input() totalElements: number = 0;
  @Input() itensPorPagina: number = 5;
  @Input() number: number = 0;
  @Input() totalPaginas: number = 0;
 
  @Output() paginaChange = new EventEmitter<number>();

  paginas: Array<number | 'ellipsis'> = [];
  primeiroItem: number = 0;
  ultimoItem: number = 0;

  ngOnChanges(): void {
    if (this.totalElements !== undefined && this.itensPorPagina && this.totalPaginas !== undefined) {
      const paginasCount = this.totalPaginas > 0 ? this.totalPaginas : 1;
      this.paginas = this.criarPaginasVisiveis(paginasCount, this.number);

      if (this.totalElements === 0) {
        this.primeiroItem = 0;
        this.ultimoItem = 0;
      } else {
        this.primeiroItem = (this.number * this.itensPorPagina) + 1;
        this.ultimoItem = Math.min((this.number + 1) * this.itensPorPagina, this.totalElements);
      }
    }
  }

  private criarPaginasVisiveis(totalPaginas: number, paginaAtual: number): Array<number | 'ellipsis'> {
    const limite = 7;
    if (totalPaginas <= limite) {
      return Array.from({ length: totalPaginas }, (_, i) => i);
    }

    const paginas: Array<number | 'ellipsis'> = [];
    const margem = 2;
    const inicio = Math.max(1, paginaAtual - margem);
    const fim = Math.min(totalPaginas - 2, paginaAtual + margem);

    paginas.push(0);

    if (inicio > 1) {
      paginas.push('ellipsis');
    }

    for (let i = inicio; i <= fim; i++) {
      paginas.push(i);
    }

    if (fim < totalPaginas - 2) {
      paginas.push('ellipsis');
    }

    paginas.push(totalPaginas - 1);
    return paginas;
  }

  irParaPagina(pagina: number): void {
    if (pagina >= 0 && pagina < this.totalPaginas && pagina !== this.number) {
      this.paginaChange.emit(pagina);
    }
  }

  anterior(): void {
    if (this.number > 0) {
      this.irParaPagina(this.number - 1);
  }
}

  proxima(): void {
   if (this.number < this.totalPaginas - 1) {
    this.irParaPagina(this.number + 1);
    }
  }
}