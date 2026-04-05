import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';

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

  @Input() largura = '100%';
  @Input() altura = '52px';
  @Input() maxLength: number = 200;

  @HostBinding('style.width')
   get hostWidth() {
     return this.largura;
  }

  @HostBinding('style.height')
   get hostHeight() {
     return this.altura;
  }

  @Output() mudou = new EventEmitter<string>();

  aoDigitar(event: Event) {
    const valor = (event.target as HTMLInputElement).value;
     this.mudou.emit(valor);
  }
}
