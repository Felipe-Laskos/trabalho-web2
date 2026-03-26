import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';

@Component({
  selector: 'app-text-area',
  standalone: true,
  imports: [],
  templateUrl: './text-area.component.html',
  styleUrl: './text-area.component.css'
})
export class TextAreaComponent {
  @Input() titulo: string = '';       
  @Input() placeholder: string = 'Ex: O notebook não liga';
  @Input() valor: string = '';       

  @Input() altura: string ='100%';
  @Input() largura: string ='120px';

  @HostBinding('style.width')
  get hostWidth() {
    return this.largura;
  }

  @HostBinding('style.height')
  get hostHeight() {
    return this.altura;
  }
 
  @HostBinding('style.display') display = 'block'; 

  @Output() mudou = new EventEmitter<string>();

  aoDigitar(event: Event) {
    const valor = (event.target as HTMLTextAreaElement).value;
     this.mudou.emit(valor);
  }
}
