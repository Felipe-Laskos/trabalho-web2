import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-autocadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './autocadastro.component.html',
  styleUrls: ['./autocadastro.component.css']
})
export class AutocadastroComponent {
  cliente = {
    cpf: '',
    nome: '',
    email: '',
    telefone: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  buscarEnderecoPorCep() {
    const cepLimpo = this.cliente.cep.replace(/\D/g, '');
    
    if (cepLimpo.length === 8) {
      this.http.get(`https://viacep.com.br/ws/${cepLimpo}/json/`).subscribe({
        next: (dados: any) => {
          if (!dados.erro) {
            this.cliente.logradouro = dados.logradouro;
            this.cliente.bairro = dados.bairro;
            this.cliente.cidade = dados.localidade;
            this.cliente.estado = dados.uf;
          } else {
            alert('CEP não encontrado. Por favor, digite o endereço manualmente.');
          }
        },
        error: () => alert('Erro ao consultar o serviço de CEP.')
      });
    }
  }

  salvarCadastro() {
    console.log('Gravando dados do cliente:', this.cliente);
    alert('Cadastro realizado com sucesso! Sua senha de 4 dígitos foi enviada para o e-mail.');
    this.router.navigate(['/login']);
  }
}