import { Component } from '@angular/core';
import { Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange } from '@angular/material/select';

export interface OpcaoCombo {
  value: string | number;
  viewValue: string;
}

@Component({
  selector: 'app-combo',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule],
  templateUrl: './combo.component.html',
  styleUrl: './combo.component.css'
})
export class ComboComponent {
  @Input() titulo: string = 'Categoria do Equipamento';
  @Input() valorSelecionado: string | number | null = null;

  @Input() lista: OpcaoCombo[] = [];

  @Input() largura = '100%';
  @Input() altura = '52px';

  @HostBinding('style.width')
    get hostWidth() {
      return this.largura;
 }

  @HostBinding('style.height')
    get hostHeight() {
     return this.altura;
 }

  @Output() mudou = new EventEmitter<string | number>();
  
  aoSelecionar(event: MatSelectChange) {
     this.mudou.emit(event.value);
  }
}
