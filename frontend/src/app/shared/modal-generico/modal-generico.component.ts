// tela do modal (ui)

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button'; 
import { CommonModule } from '@angular/common';

export interface ModalDados{
  titulo?: string;
  mensagem?: string;
  textoConfirmar?: string;
  textoCancelar?: string;
}

@Component({
  selector: 'app-modal-generico',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './modal-generico.component.html',
  styleUrl: './modal-generico.component.css'
})

export class ModalGenericoComponent {

  constructor(
    public dialogRef: MatDialogRef<ModalGenericoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalDados
  ) {}

  confirmar() {
    this.dialogRef.close(true);
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}
