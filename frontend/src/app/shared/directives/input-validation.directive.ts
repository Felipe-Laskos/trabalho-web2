import { Directive, Input, HostListener, Output, EventEmitter} from '@angular/core';

@Directive({
  selector: '[appInputValidation]',
  standalone: true
})
export class InputValidationDirective {
  @Input() decimal: boolean = false;
  @Input() inteiro: boolean = false;
  @Input() textoNum: boolean = false; // não aceita só número (ex: descrição do defeito)
  @Input() texto: boolean = false; // aceita apenas texto (ex: cidade)
  @Input() email: boolean = false;
  @Input() msgAviso: string = '';
  @Input() obrigatorio: boolean = false;

  @Output() avisoEmitido = new EventEmitter<string>();
  @Output() avisoOculto = new EventEmitter<void>();
  
  private timerAviso: any;
  private spanAviso: any;

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (!this.decimal && !this.inteiro && !this.texto) return;

    const permitidos = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
    let valido = false; 

    if (this.decimal) {
      valido = /^[0-9.,]$/.test(event.key);
    } else if (this.inteiro) {
      valido = /^[0-9]$/.test(event.key);
    } else if (this.texto) {
      valido = /^[a-zA-Z\sÀ-ÿ]$/.test(event.key);
    }

     if (!permitidos.includes(event.key) && !valido) {
      event.preventDefault();
      this.mostrarAviso();
    }
  }

@HostListener('focusout', ['$event'])
onBlur(event: FocusEvent) {
  const input = event.target as HTMLInputElement;
  const valor = input.value ?? '';

  if (this.obrigatorio && !valor.trim()) {
    this.mostrarAviso('Campo obrigatório');
    return;
  }

  if (this.textoNum) {
    const soNumero = /^\d+$/.test(valor.trim());
    if (soNumero) {
      this.mostrarAviso();
      return;
    }
  }

  if (this.email) {
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim());
    if (!emailValido) {
      this.mostrarAviso();
      return;
    }
  }
  
  this.avisoOculto.emit();
  }

  private getMsgAviso() {
    if (this.decimal) return 'Apenas números são permitidos.';
    if (this.inteiro) return 'Apenas números são permitidos.';
    if (this.textoNum) return 'O campo não pode conter apenas números.';
    if (this.texto) return 'Apenas textos são permitidos.';
    if (this.email) return 'Formato de e-mail inválido.';
    return 'Caractere inválido';
  }

  private mostrarAviso(msgCustom?: string) {
    const msg = msgCustom || this.msgAviso || this.getMsgAviso();

    this.avisoEmitido.emit(msg);

    clearTimeout(this.timerAviso);
    this.timerAviso = setTimeout(() => {
      this.avisoOculto.emit();
    }, 2000);
  }
}
