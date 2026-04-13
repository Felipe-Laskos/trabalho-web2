import { Component, Input, Output, EventEmitter, HostBinding, HostListener, ChangeDetectorRef } from '@angular/core';
import { InputValidationDirective  } from '../directives/input-validation.directive'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-text-area',
  standalone: true,
  imports: [CommonModule],
  hostDirectives: [
    {
      directive: InputValidationDirective,
      inputs: ['textoNum', 'msgAviso'],
      outputs: ['avisoEmitido', 'avisoOculto']
    }
  ],
  templateUrl: './text-area.component.html',
  styleUrl: './text-area.component.css'
})
export class TextAreaComponent {
  @Input() titulo: string = '';       
  @Input() placeholder: string = 'Ex: O notebook não liga';
  @Input() valor: string = '';   
  @Input() obrigatorio: boolean = false;    

  @Input() altura: string ='100%';
  @Input() largura: string ='120px';
  @Input() maxLength: number = 200;

  @HostBinding('style.width')
  get hostWidth() {
    return this.largura;
  }

  @HostBinding('style.height')
  get hostHeight() {
    return this.altura;
  }
 
  @HostBinding('style.display') display = 'block'; 

  exibirObrigatorio: boolean = false;
  msgDirective: string = '';
  private timerObrigatorio: any

  constructor(private cdr: ChangeDetectorRef, private directive: InputValidationDirective) {
    this.directive.avisoEmitido.subscribe((msg: string) => {
      this.msgDirective = msg;
      this.exibirObrigatorio = false;
      this.cdr.markForCheck();
    });
    this.directive.avisoOculto.subscribe(() => {
      this.msgDirective = '';
      this.cdr.markForCheck();
    });
  }

  @HostListener('focusout')
  onFocusOut() {
    if (this.obrigatorio && !this.valor && !this.msgDirective) {
      this.exibirObrigatorio = true;
      this.cdr.markForCheck();

      clearTimeout(this.timerObrigatorio);
      this.timerObrigatorio = setTimeout(() => {
        this.exibirObrigatorio = false;
        this.cdr.markForCheck();
      }, 2000);
    } else {
      this.exibirObrigatorio = false;
      this.cdr.markForCheck();
    }
  }

  @Output() mudou = new EventEmitter<string>();

  aoDigitar(event: Event) {
    const valor = (event.target as HTMLTextAreaElement).value;
     this.mudou.emit(valor);
  }
}
