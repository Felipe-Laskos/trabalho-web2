import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-paginacao',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './paginacao.component.html',
  styleUrl: './paginacao.component.css'
})
export class PaginacaoComponent implements OnChanges {


  @Input() totalElements: number = 0;
  @Input() itensPorPagina: number = 5;
  @Input() number: number = 0;
  @Input() totalPaginas: number = 0;
 
  @Output() paginaChange = new EventEmitter<number>();

  paginas: number[] = [];
  primeiroItem: number = 0;
  ultimoItem: number = 0;

  ngOnChanges(): void {
    if (this.totalElements !== undefined && this.itensPorPagina && this.totalPaginas !== undefined) {
      const paginasCount = this.totalPaginas > 0 ? this.totalPaginas : 1;
      this.paginas = Array.from({ length: paginasCount }, (_, i) => i);

      if (this.totalElements === 0) {
        this.primeiroItem = 0;
        this.ultimoItem = 0;
      } else {
        this.primeiroItem = (this.number * this.itensPorPagina) + 1;
        this.ultimoItem = Math.min((this.number + 1) * this.itensPorPagina, this.totalElements);
      }
    }
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