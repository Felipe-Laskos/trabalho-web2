import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pesquisa',
  standalone: true,
  imports: [FormsModule, MatInputModule, MatFormFieldModule, MatIconModule],
  templateUrl: './pesquisa.component.html',
  styleUrl: './pesquisa.component.css'
})
export class PesquisaComponent {
  @Input() placeholder: string = 'Buscar...';
  @Input() valor: string = '';

  @Output() valorChange = new EventEmitter<string>();
  @Output() pesquisou = new EventEmitter<string>();

  onInput(valor: string): void {
    this.valor = valor;
    this.valorChange.emit(valor);
  }

  onPesquisar(): void {
    this.pesquisou.emit(this.valor);
  }
}
