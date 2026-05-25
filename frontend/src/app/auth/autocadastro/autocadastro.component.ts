import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { InputCardComponent } from '../../shared/input-card/input-card.component';
import { BotaoAprovarComponent } from '../../shared/botao-aprovar/botao-aprovar.component';
import { BotaoCancelarComponent } from '../../shared/botao-cancelar/botao-cancelar.component';
import { InputComponent } from "../../shared/input/input.component";
import { CardVisualizacaoComponent } from "../../shared/card-visualizacao/card-visualizacao.component";
import { ModalGenericoComponent } from "../../shared/modal-generico/modal-generico.component";
import { ClienteService } from '../../core/services/cliente.service';
import { ClienteRequest } from '../../core/dto/request/cliente-request.model';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-autocadastro',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
    complemento: ''
  };

  exibirModal = false;
  camposTocados: any = {};
  enviando = false;
  
  errorsFromServer: any = {};

  private clienteService = inject(ClienteService);
  private notificationService = inject(NotificationService);
  private dialog = inject(MatDialog);

  constructor(public router: Router, private http: HttpClient) {}

  buscarCep() {
    const cepLimpo = this.usuario.cep ? this.usuario.cep.replace(/\D/g, '') : '';
    
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

  onSubmit(form: NgForm) {
    if (this.enviando) return;

    this.errorsFromServer = {};

    if (!this.usuario.nome || !this.usuario.cpf || !this.usuario.email ||
        !this.usuario.telefone || !this.usuario.cep) {
      this.notificationService.exibirAviso('Preencha todos os campos obrigatórios!');
      return;
    }
    
    const cpfLimpo = this.usuario.cpf.replace(/\D/g, '');
    const telefoneLimpo = this.usuario.telefone.replace(/\D/g, '');
    const cepLimpo = this.usuario.cep.replace(/\D/g, '');

    const requisicao: ClienteRequest = {
      nome: this.usuario.nome,
      cpf: cpfLimpo,
      email: this.usuario.email,
      telefone: telefoneLimpo,
      endereco: {
        cep: cepLimpo,
        logradouro: this.usuario.logradouro,
        bairro: this.usuario.bairro,
        cidade: this.usuario.cidade,
        uf: this.usuario.uf,
        numero: this.usuario.numero,
        complemento: this.usuario.complemento
      }
    };

    this.enviando = true;
    this.clienteService.autocadastrar(requisicao).subscribe({
      next: () => {
        this.enviando = false;
        const dialogRef = this.dialog.open(ModalGenericoComponent, {
          width: '400px',
          data: {
            titulo: 'Cadastro Concluído',
            mensagem: 'Seu cadastro foi realizado com sucesso! Sua senha de acesso foi enviada para o seu e-mail.'
          }
        });
        dialogRef.afterClosed().subscribe(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (err: any) => {
        this.enviando = false;
        if (err.status === 400 && err.error?.fieldErrors) {
          this.errorsFromServer = err.error.fieldErrors;
          this.notificationService.exibirAviso('Por favor, corrija os erros no formulário.');
        } else {
          this.notificationService.exibirAviso(err?.error?.message || 'Erro ao realizar cadastro. Por favor, tente novamente.');
        }
      }
    });
  }
}