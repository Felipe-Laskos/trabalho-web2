import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) { }

  exibirSucesso(mensagem: string): void {
    this.snackBar.open(mensagem, 'OK', {
      duration: 3000,
      panelClass: ['snack-sucesso'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  exibirAviso(mensagem: string): void {
    this.snackBar.open(mensagem, 'Atenção', {
      duration: 4000,
      panelClass: ['snack-erro'], 
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  exibirErro(erro: HttpErrorResponse | string): void {
    let msg = 'Erro inesperado. Tente novamente.';

    if (typeof erro === 'string') {
      msg = erro;
    } else {
        if (erro.status === 400 && erro.error?.erros) {
        const msgValidacao = Object.values(erro.error.erros);

        if(msgValidacao.length > 0) {
            msg = msgValidacao[0] as string;
        }
    }
    else if (erro.error?.mensagem) {
        msg = erro.error.mensagem;
    } 
    else if (erro.status >= 500) {
        msg = 'Erro interno no servidor. Tente novamente mais tarde.';
    }

    this.snackBar.open(msg, 'Fechar', {
      duration: 5000,
      panelClass: ['snack-erro'], 
      horizontalPosition: 'right',
      verticalPosition: 'top'
     });
    }
  }
}