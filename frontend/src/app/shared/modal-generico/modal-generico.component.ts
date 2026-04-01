import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputCardComponent } from '../input-card/input-card.component';
import { cpfValidator } from '../validators/cpf.validator';
import { FormControl } from '@angular/forms';
import { EmailValidator } from '../validators/email.validator';

export interface CampoFormulario {
  label: string;
  campo: string;
  tipo?: 'text' | 'number' | 'select';
  obrigatorio?: boolean;
}

export interface ModalDados{
  tipo?: 'confirmacao' | 'formulario';
  titulo?: string;
  mensagem?: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  campos?: CampoFormulario[];
  formData?: any; 
}

@Component({
  selector: 'app-modal-generico',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    InputCardComponent,
  ],
  templateUrl: './modal-generico.component.html',
  styleUrl: './modal-generico.component.css'
})

export class ModalGenericoComponent {
  formData: any = {};

  constructor(
    public dialogRef: MatDialogRef<ModalGenericoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalDados
  ) {
    if (this.data.tipo === 'formulario') {
      this.formData = { ...this.data.formData };
      }
    }

   confirmar() {
    if (this.data.tipo === 'formulario') {

      if (this.formData.cpf) {
      const control = new FormControl(this.formData.cpf);
      const erro = cpfValidator(control);

      if (erro) {
        alert('CPF inválido!');
        return;
      }
      }

    if (this.formData.email) {
      const emailControl = new FormControl(this.formData.email);
      if (EmailValidator(emailControl)) {
        alert('Email inválido!');
        return;
      }
    }
    
    const camposInvalidos = (this.data.campos || []).filter(campo => {
      const valor = this.formData?.[campo.campo];

      return (
        campo.obrigatorio === true && (
          valor === null ||
          valor === undefined ||
          valor.toString().trim() === ''
        )
      );
    });

    if (camposInvalidos && camposInvalidos.length > 0) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

      this.dialogRef.close(this.formData);
    } else {
      this.dialogRef.close(true);
    }
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}