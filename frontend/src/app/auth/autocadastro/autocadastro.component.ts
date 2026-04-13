import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ValidarCpf } from './validacao-cpf';  // isso aqui tem q sair, já existe um validator de cpf 
import { InputCardComponent } from '../../shared/input-card/input-card.component';
import { BotaoAprovarComponent } from '../../shared/botao-aprovar/botao-aprovar.component';
import { BotaoCancelarComponent } from '../../shared/botao-cancelar/botao-cancelar.component';
import { InputComponent } from "../../shared/input/input.component";
import { CardVisualizacaoComponent } from "../../shared/card-visualizacao/card-visualizacao.component";
import { ModalGenericoComponent } from "../../shared/modal-generico/modal-generico.component";
import { ClienteService } from '../../core/services/cliente.service';
import { FuncionarioService } from '../../core/services/funcionario.service';

@Component({
  selector: 'app-autocadastro',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
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
    uf: '',
    numero: '',
    complemento: '',
    senha: ''
  };

  exibirModal = false;
  camposTocados: any = {};
  private clienteService = inject(ClienteService);
  private funcionarioService = inject(FuncionarioService);
  private dialog = inject(MatDialog);

  constructor(public router: Router, private http: HttpClient) {}

  aplicarMascaraCPF(valor: string) {
    let v = valor.replace(/\D/g, '');
    if (v.length > 11) v = v.substring(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    this.usuario.cpf = v;
    this.usuario.cpf = valor; 
      setTimeout(() => {
        this.usuario.cpf = v;
      });
  }

  aplicarMascaraTelefone(valor: string) {
    let v = valor.replace(/\D/g, '');
    if (v.length > 11) v = v.substring(0, 11);
    v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
    v = v.replace(/(\d{5})(\d)/, '$1-$2');
    this.usuario.telefone = v;
    this.usuario.telefone = valor;
      setTimeout(() => {
        this.usuario.telefone = v;
      });
  }
  aplicarMascaraCEP(valor: string) {
    let v = valor.replace(/\D/g, '');
    if (v.length > 8) v = v.substring(0, 8);
    v = v.replace(/(\d{5})(\d)/, '$1-$2');
    this.usuario.cep = v;
    this.usuario.cep = valor;
    setTimeout(() => {
      this.usuario.cep = v;
    });
  }

  buscarCep() {
    const cepLimpo = this.usuario.cep.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      this.http.get<any>(`https://viacep.com.br/ws/${cepLimpo}/json/`).subscribe(dados => {
        if (!dados.erro) {
          this.usuario.logradouro = dados.logradouro;
          this.usuario.bairro = dados.bairro;
          this.usuario.cidade = dados.localidade;
          this.usuario.uf = dados.uf;
        }
      });
    }
  }

  gerarSenhaAleatoria(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  onSubmit(form: NgForm) {
    if (!this.usuario.nome || !this.usuario.cpf || !this.usuario.email ||
        !this.usuario.telefone || !this.usuario.cep) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    const controleCpf = new FormControl(this.usuario.cpf);
    const erroCpf = ValidarCpf()(controleCpf);

    if (erroCpf !== null) {
      alert('CPF Inválido!');
      return;
    }

    if (this.clienteService.buscarPorEmail(this.usuario.email) ||
        this.funcionarioService.buscarPorEmail(this.usuario.email)) {
      alert('E-mail já cadastrado no sistema!');
      return;
    }

    const cpfLimpo = this.usuario.cpf.replace(/\D/g, '');
    if (this.clienteService.listarTodos().find(c => c.cpf.replace(/\D/g, '') === cpfLimpo)) {
      alert('CPF já cadastrado!');
      return;
    }

    this.usuario.senha = this.gerarSenhaAleatoria();
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
        uf: this.usuario.uf,
        numero: this.usuario.numero,
        complemento: this.usuario.complemento
      }
    });
    const dialogRef = this.dialog.open(ModalGenericoComponent, {
      width: '400px',
      data: {
        titulo: 'Cadastro Concluído',
        mensagem: `Seu cadastro foi realizado com sucesso! Sua senha de acesso gerada é: ${this.usuario.senha}`
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
