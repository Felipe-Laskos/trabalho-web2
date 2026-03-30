import { Component } from '@angular/core';
import { EventEmitter, Output, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-botao-cancelar',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './botao-cancelar.component.html',
  styleUrl: './botao-cancelar.component.css'
})
export class BotaoCancelarComponent {
   @Input() confirmacao: boolean = false;
   @Output() clicou = new EventEmitter<void>();

  click() {
    this.clicou.emit();
  }
}
