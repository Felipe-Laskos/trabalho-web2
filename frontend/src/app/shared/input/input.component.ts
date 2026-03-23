import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css'
})
export class InputComponent {
  @Input() tipo: string = 'text';
  @Input() titulo: string = '';
  @Input() placeholder: string = '';
  @Input() valor: string = '';

  @Output() mudou = new EventEmitter<string>();

  aoDigitar(event: Event) {
    const valor = (event.target as HTMLInputElement).value;
     this.mudou.emit(valor);
  }
}
