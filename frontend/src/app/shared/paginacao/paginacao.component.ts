import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-paginacao',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './paginacao.component.html',
  styleUrl: './paginacao.component.css'
})
export class PaginacaoComponent {
  @Input() totalItens: number = 0;
  @Input() itensPorPagina: number = 4;
  @Input() paginaAtual: number = 1;

  @Output() paginaChange = new EventEmitter<number>();

  get totalPaginas(): number {
    return Math.ceil(this.totalItens / this.itensPorPagina);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  get primeiroItem(): number {
    return (this.paginaAtual - 1) * this.itensPorPagina + 1;
  }

  get ultimoItem(): number {
    return Math.min(this.paginaAtual * this.itensPorPagina, this.totalItens);
  }

  irParaPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaAtual = pagina;
      this.paginaChange.emit(this.paginaAtual);
    }
  }

  anterior(): void {
    this.irParaPagina(this.paginaAtual - 1);
  }

  proxima(): void {
    this.irParaPagina(this.paginaAtual + 1);
  }
}
