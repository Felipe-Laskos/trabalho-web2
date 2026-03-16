import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usuario = {
    email: '',
    senha: ''
  };

  constructor(private router: Router) {}

  efetuarLogin() {
    console.log('Tentativa de login com:', this.usuario.email);

    if (this.usuario.email.includes('funcionario')) {
      alert('Login realizado como Funcionário!');
      this.router.navigate(['/funcionario/home']);
    } else {
      alert('Login realizado como Cliente!');
      this.router.navigate(['/cliente/home']);
    }
  }
}