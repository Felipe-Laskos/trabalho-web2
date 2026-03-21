import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-botao',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './botao.component.html',
  styleUrl: './botao.component.css'
})
export class BotaoComponent {
  @Input() texto: string = 'Clique Aqui';
  @Input() icone: string = '';
  @Input() cor: 'primary' | 'warn' | 'accent' = "primary";
  @Input() desabilitado: boolean = false;

  @Output() clicou = new EventEmitter<void>();

  onClick(): void {
    this.clicou.emit();
  }
}
