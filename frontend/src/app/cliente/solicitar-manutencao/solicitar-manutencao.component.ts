import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModalGenericoComponent } from '../../shared/modal-generico/modal-generico.component';

@Component({
  selector: 'app-solicitar-manutencao',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink, MatCardModule, 
    MatFormFieldModule, MatInputModule, MatSelectModule, 
    MatButtonModule, MatIconModule, MatDialogModule
  ],
  templateUrl: './solicitar-manutencao.component.html',
  styleUrls: ['./solicitar-manutencao.component.css']
})
export class SolicitarManutencaoComponent {

  solicitacao = {
    categoria: '',
    modelo: '',
    descricaoDefeito: ''
  };

  categorias: string[] = [
    'Notebook', 
    'Desktop', 
    'Impressora', 
    'Monitor', 
    'Outros'];

  constructor(private dialog: MatDialog, private router: Router) {}

  salvarSolicitacao() {
  const dialogRef = this.dialog.open(ModalGenericoComponent, {
    width: '400px',
    data: {
      titulo: 'Confirmar Envio',
      mensagem: 'Deseja enviar esta solicitação de manutenção?',
      textoConfirmar: 'Enviar Solicitação',
      textoCancelar: 'Cancelar'
    }
  });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        const pedidoFinal = {
          ...this.solicitacao,
          status: 'ABERTA',
          dataCriacao: new Date().toISOString(),
          clienteId: 1
        };

        console.log('Salvando solicitação:', pedidoFinal);
        alert('Solicitação aberta com sucesso! Status: ABERTA');
        this.router.navigate(['/cliente']);
      }
    });
  }
}