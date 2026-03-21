import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-card-info',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './card-info.component.html',
  styleUrl: './card-info.component.css'
})
export class CardInfoComponent {
  @Input() tituloInfo: string = 'Título Info';
  @Input() descricao: string = 'Descrição Card';
  @Input() nomeIcon: string = 'code';
}
