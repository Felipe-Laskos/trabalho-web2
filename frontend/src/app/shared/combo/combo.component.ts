import { Component } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
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
  @Input() label: string = 'Selecione uma opção (Exemplo)';
  @Input() titulo: string = 'Categoria do Equipamento';
  @Input() valorSelecionado: string | number | null = null;

  @Input() lista: OpcaoCombo[] = [];

  @Output() mudou = new EventEmitter<string | number>();
  
  aoSelecionar(event: MatSelectChange) {
     this.mudou.emit(event.value);
  }
}
