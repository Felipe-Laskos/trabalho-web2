import { Component, Input, Output, EventEmitter, HostBinding, HostListener, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputValidationDirective } from '../directives/input-validation.directive';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, InputValidationDirective],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css'
})
export class InputComponent {
  @Input() tipo: string = 'text';
  @Input() titulo: string = '';
  @Input() placeholder: string = '';
  @Input() valor: string = '';
  @Input() obrigatorio: boolean = false;
  @Input() largura = '100%';
  @Input() altura = '52px';
  @Input() maxLength: number = 200;

  @Input() decimal = false;
  @Input() inteiro = false;
  @Input() texto = false;
  @Input() textoNum = false;
  @Input() email = false;
  @Input() msgAviso: string = '';
  @Input() readonly = false;
  @Input() esconderLabel: boolean = false;

  @HostBinding('style.width')
   get hostWidth() {
     return this.largura;
  }

  @HostBinding('style.height')
   get hostHeight() {
     return this.altura;
  }

  @Output() mudou = new EventEmitter<string>();

  msgDirective: string = ''; 

  constructor(private cdr: ChangeDetectorRef) {}

  onAvisoEmitido(msg: unknown) {
    this.msgDirective = msg as string;
    this.cdr.markForCheck();
  }

  onAvisoOculto() {
    this.msgDirective = '';
    this.cdr.markForCheck();
  }

  aoDigitar(event: Event) {
    const valor = (event.target as HTMLInputElement).value;
    this.mudou.emit(valor);
  }
}
