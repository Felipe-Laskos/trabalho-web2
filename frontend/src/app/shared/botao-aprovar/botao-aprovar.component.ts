import { Component } from '@angular/core';
import { EventEmitter, Output, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-botao-aprovar',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './botao-aprovar.component.html',
  styleUrl: './botao-aprovar.component.css'
})
export class BotaoAprovarComponent {
  @Input() desabilitado = false;

  @Output() clicou = new EventEmitter<void>();

  onClick() {
    this.clicou.emit();
  }
}
