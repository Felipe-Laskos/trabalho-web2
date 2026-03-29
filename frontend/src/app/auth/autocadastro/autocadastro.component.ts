import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { ValidarCpf } from './validacao-cpf';
import { InputCardComponent } from '../../shared/input-card/input-card.component';
import { BotaoAprovarComponent } from '../../shared/botao-aprovar/botao-aprovar.component';
import { BotaoCancelarComponent } from '../../shared/botao-cancelar/botao-cancelar.component';

@Component({
  selector: 'app-autocadastro',
  standalone: true,
  providers: [provideNgxMask()],
  imports: [
    CommonModule, 
    FormsModule, 
    HttpClientModule, 
    NgxMaskDirective, 
    NgxMaskPipe, 
    InputCardComponent, 
    BotaoAprovarComponent, 
    BotaoCancelarComponent
  ],
  templateUrl: './autocadastro.component.html',
  styleUrls: ['./autocadastro.component.css']
})
export class AutocadastroComponent {
  usuario = {
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    cep: '',
    logradouro: '',
    bairro: '',
    cidade: '',
    senha: ''
  };

  constructor(public router: Router, private http: HttpClient) {}

  buscarCep() {
    const cepLimpo = this.usuario.cep.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      this.http.get<any>(`https://viacep.com.br/ws/${cepLimpo}/json/`).subscribe(dados => {
        if (!dados.erro) {
          this.usuario.logradouro = dados.logradouro;
          this.usuario.bairro = dados.bairro;
          this.usuario.cidade = dados.localidade;
        }
      });
    }
  }

    onSubmit(form: NgForm) {
    const controleCpf = new FormControl(this.usuario.cpf);
    const erroCpf = ValidarCpf()(controleCpf);

    if (form.valid && erroCpf === null) {
      console.log('Sucesso! Tudo validado:', this.usuario);
      this.router.navigate(['/login']);
    } else {
      const mensagem = erroCpf ? 'CPF Inválido!' : 'Preencha todos os campos obrigatórios!';
      alert(mensagem);
    }
  }
}