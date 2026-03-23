import { Component, Input, Output, EventEmitter } from '@angular/core';

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
 
  @Output() mudou = new EventEmitter<string>();

  aoDigitar(event: Event) {
    const valor = (event.target as HTMLTextAreaElement).value;
     this.mudou.emit(valor);
  }
}
