import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-card-avaliacao',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './card-avaliacao.component.html',
  styleUrl: './card-avaliacao.component.css'
})
export class CardAvaliacaoComponent {
  @Input() nomeUsuario: string = '';
  @Input() descricao: string = '';
  @Input() nota: number = 0;

  get estrelas(): boolean[] {
    return Array(5).fill(false).map((_, i) => i < this.nota);
  }
}
