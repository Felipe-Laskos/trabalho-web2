import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ValidarCpf } from './validacao-cpf';
import { InputCardComponent } from '../../shared/input-card/input-card.component';
import { BotaoAprovarComponent } from '../../shared/botao-aprovar/botao-aprovar.component';
import { BotaoCancelarComponent } from '../../shared/botao-cancelar/botao-cancelar.component';
import { InputComponent } from "../../shared/input/input.component";
import { CardVisualizacaoComponent } from "../../shared/card-visualizacao/card-visualizacao.component";
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-autocadastro',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    InputCardComponent,
    BotaoAprovarComponent,
    BotaoCancelarComponent,
    InputComponent,
    CardVisualizacaoComponent
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

  private clienteService = inject(ClienteService);

  constructor(public router: Router, private http: HttpClient) {}
  
  aplicarMascaraCPF(valor: string) {
    let v = valor.replace(/\D/g, ''); // Remove não dígitos [cite: 36]
    if (v.length > 11) v = v.substring(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    this.usuario.cpf = v;
  }

  aplicarMascaraTelefone(valor: string) {
    let v = valor.replace(/\D/g, ''); // [cite: 36]
    if (v.length > 11) v = v.substring(0, 11);
    v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
    v = v.replace(/(\d{5})(\d)/, '$1-$2');
    this.usuario.telefone = v;
  }

  aplicarMascaraCEP(valor: string) {
    let v = valor.replace(/\D/g, ''); // [cite: 36]
    if (v.length > 8) v = v.substring(0, 8);
    v = v.replace(/(\d{5})(\d)/, '$1-$2');
    this.usuario.cep = v;
  }

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
      this.clienteService.inserir({
        nome: this.usuario.nome,
        cpf: this.usuario.cpf,
        email: this.usuario.email,
        telefone: this.usuario.telefone,
        senha: this.usuario.senha,
        endereco: {
          cep: this.usuario.cep,
          logradouro: this.usuario.logradouro,
          bairro: this.usuario.bairro,
          cidade: this.usuario.cidade,
          uf: '',
          numero: ''
        }
      });
      this.router.navigate(['/login']);
    } else {
      const mensagem = erroCpf ? 'CPF Inválido!' : 'Preencha todos os campos obrigatórios!';
      alert(mensagem);
    }
  }
}