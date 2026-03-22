import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink, 
    MatCardModule, 
    MatInputModule, 
    MatFormFieldModule, 
    MatButtonModule, 
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usuario = { email: '', 
  senha: '' };
  constructor(private router: Router) {}

  efetuarLogin() {
  let nomeExibicao = localStorage.getItem('nomeUsuarioCadastrado');

  if (!nomeExibicao) {
    nomeExibicao = this.usuario.email.split('@')[0];
  }

  localStorage.setItem('usuarioSessao', nomeExibicao);

    if (this.usuario.email.toLowerCase().includes('func')) {
      this.router.navigate(['/funcionario']);
    } else {
      this.router.navigate(['/cliente']);
    }
  }
}