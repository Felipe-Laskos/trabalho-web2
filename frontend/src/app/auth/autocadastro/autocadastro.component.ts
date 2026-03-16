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
    rua: '',
    bairro: '',
    cidade: '',
    estado: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  buscarEndereco() {
    const cepNumeros = this.cliente.cep.replace(/\D/g, '');
    
    if (cepNumeros.length === 8) {
      this.http.get(`https://viacep.com.br/ws/${cepNumeros}/json/`).subscribe({
        next: (dados: any) => {
          if (!dados.erro) {
            this.cliente.rua = dados.logradouro;
            this.cliente.bairro = dados.bairro;
            this.cliente.cidade = dados.localidade;
            this.cliente.estado = dados.uf;
          } else {
            alert('CEP não encontrado!');
          }
        },
        error: () => {
          alert('Erro ao consultar o serviço de CEP.');
        }
      });
    }
  }

  finalizarCadastro() {
    console.log('Dados para cadastro:', this.cliente);
    alert('Cadastro realizado! A senha de 4 dígitos foi enviada para o e-mail informado.');
    this.router.navigate(['/login']);
  }
}