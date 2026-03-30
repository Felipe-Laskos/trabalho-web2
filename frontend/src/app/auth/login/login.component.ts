import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { InputComponent } from '../../shared/input/input.component';
import { BotaoAprovarComponent } from '../../shared/botao-aprovar/botao-aprovar.component';
import { CardVisualizacaoComponent } from "../../shared/card-visualizacao/card-visualizacao.component";
import { InputCardComponent } from "../../shared/input-card/input-card.component";
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSnackBarModule,
    InputComponent,
    BotaoAprovarComponent,
    CardVisualizacaoComponent,
    InputCardComponent
],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credenciais = {
    email: '',
    senha: ''
  };
  emailTocado = false;
  senhaTocado = false;
  enviou = false;

  private authService = inject(AuthService);

  constructor(private router: Router, private aviso: MatSnackBar) {}

  marcarComoTocado(campo: string) {
    if (campo === 'email') this.emailTocado = true;
    if (campo === 'senha') this.senhaTocado = true;
  }

  efetuarLogin() {
    this.enviou = true;

    if (!this.credenciais.email || !this.credenciais.senha) {
      this.aviso.open('Por favor, preencha todos os campos obrigatórios.', 'FECHAR', {
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: ['snack-erro-destaque']
      });
      return;
    }

    const resultado = this.authService.validarLogin(this.credenciais.email, this.credenciais.senha);

    if (resultado.sucesso) {
      const perfil = this.authService.getPerfil();
      this.router.navigate([perfil === 'funcionario' ? '/funcionario' : '/cliente']);
    } else {
      this.aviso.open(resultado.mensagem, 'FECHAR', {
        panelClass: ['snack-erro-destaque']
      });
    }
  }
}