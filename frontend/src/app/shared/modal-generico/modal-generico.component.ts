import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputCardComponent } from '../input-card/input-card.component';
import { cpfValidator } from '../validators/cpf.validator';
import { FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { InputComponent } from '../input/input.component';

export interface CampoFormulario {
  label: string;
  campo: string;
  tipo?: 'text' | 'number' | 'select';
  obrigatorio?: boolean;
  senha?: string;
  readonly?: boolean;

  validacao?: 'texto' | 'textoNum' | 'email' | 'inteiro';
  msgAviso?: string;
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
    MatIconModule,
    InputComponent
  ],
  templateUrl: './modal-generico.component.html',
  styleUrl: './modal-generico.component.css'
})

export class ModalGenericoComponent {
  formData: any = {};
  isCpfReadonly: boolean = false;
  mostrarSenha: { [key: string]: boolean } = {};

  constructor(
    public dialogRef: MatDialogRef<ModalGenericoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalDados
  ) {
    if (this.data.tipo === 'formulario') {
      this.formData = { ...this.data.formData };
      this.isCpfReadonly = this.data.campos?.some(
        c => c.campo === 'cpf' && c.readonly
      ) || false;
    }
    }

   confirmar() {
    if (this.data.tipo === 'formulario') {

    if (this.formData.cpf && !this.isCpfReadonly) {
      const cpfLimpo = this.formData.cpf.replace(/\D/g, '');

      const control = new FormControl(cpfLimpo);
      const erro = cpfValidator(control);

      if (erro) {
        alert('CPF inválido!');
        return;
      }

      this.formData.cpf = cpfLimpo;
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