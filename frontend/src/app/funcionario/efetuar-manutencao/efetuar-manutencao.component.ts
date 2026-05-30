import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Solicitacao } from '../../core/models/solicitacao.model';
import { SolicitacaoENUM } from '../../core/models/solicitacaoENUM.model';
import { SolicitacaoService } from '../../core/services/solicitacao.service';
import { CardVisualizacaoComponent } from '../../shared/card-visualizacao/card-visualizacao.component';
import { BotaoComponent } from '../../shared/botao/botao.component';
import { TextAreaComponent } from '../../shared/text-area/text-area.component';
import { BotaoAprovarComponent } from '../../shared/botao-aprovar/botao-aprovar.component';
import { BotaoCancelarComponent } from '../../shared/botao-cancelar/botao-cancelar.component';
import { ModalGenericoComponent, ModalDados } from '../../shared/modal-generico/modal-generico.component';
import { NotificationService } from '../../core/services/notification.service';
import { TelefonePipe } from '../../shared/pipes/telefone.pipe';
import { CpfPipe } from '../../shared/pipes/cpf.pipe';
import { CepPipe } from '../../shared/pipes/cep.pipe';

@Component({
  selector: 'app-efetuar-manutencao',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatDialogModule,
    CardVisualizacaoComponent,
    BotaoComponent,
    TextAreaComponent,
    BotaoAprovarComponent,
    BotaoCancelarComponent,
    TelefonePipe,
    CpfPipe,
    CepPipe
  ],
  templateUrl: './efetuar-manutencao.component.html',
  styleUrls: ['./efetuar-manutencao.component.css'],
})
export class EfetuarManutencaoComponent implements OnInit {
  private solicitacaoService = inject(SolicitacaoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private aviso = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private notificationService = inject(NotificationService);

  solicitacao?: Solicitacao;
  mostrarFormulario = false;
  dataHoraAcesso: Date = new Date();
  botaoDesativado: boolean = false;
  exibirToastSucesso: boolean = false;

  form = new FormGroup({
    descricao: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]),
    orientacoes: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]),
  });

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];

    this.solicitacaoService.buscarPorId(id).subscribe({
      next: (res) => {
        if (
          res &&
          (res.estadoAtual === SolicitacaoENUM.APROVADA ||
            res.estadoAtual === SolicitacaoENUM.REDIRECIONADA)
        ) {
          this.solicitacao = res;
        } else {
          this.aviso.open(
            'Solicitação não encontrada ou não está disponível para manutenção.',
            'OK',
            { duration: 3000 },
          );
          this.router.navigate(['/funcionario/visualizar-solicitacoes']);
        }
      },
      error: (err) => {
        this.notificationService.exibirErro(err);
        this.router.navigate(['/funcionario/visualizar-solicitacoes']);
      },
    });
  }

  abrirFormulario() {
    if (this.botaoDesativado) return;
    this.mostrarFormulario = true;
  }

  confirmarManutencao(): void {
    const dados = this.form.value;
    const descricao = dados.descricao;
    const orientacoes = dados.orientacoes;

    if (!descricao || !orientacoes) {
      this.aviso.open('Preencha todos os campos!', 'OK', {
        duration: 3000,
        verticalPosition: 'top',
      });
      return;
    }

    if (!this.solicitacao) return;

    this.solicitacaoService.efetuarManutencao(this.solicitacao.id!, {
      descricaoManutencao: descricao,
      orientacoesCliente: orientacoes,
    }).subscribe({
      next: () => {
        this.form.reset();
        this.mostrarFormulario = false;
        this.exibirToastSucesso = true;

        setTimeout(() => {
          this.exibirToastSucesso = false;
          this.router.navigate(['/funcionario/visualizar-solicitacoes']);
        }, 2500);
      },
      error: (err) => {
        this.notificationService.exibirErro(err);
      },
    });
  }

  redirecionar() {
    if (this.botaoDesativado) return;
    if (this.solicitacao) {
      this.router.navigate([
        '/funcionario/redirecionar-manutencao',
        this.solicitacao.id,
      ]);
    } else {
      this.notificationService.exibirAviso('Nenhuma solicitação encontrada para redirecionar!');
    }
  }

  aprovarServico(): void {
    if (this.form.invalid) {
      this.aviso.open(
        'Preencha todos os campos obrigatórios antes de aprovar.',
        'OK',
        { duration: 3000 },
      );
      return;
    }

    if (this.botaoDesativado) return;

    const dialogRef = this.dialog.open(ModalGenericoComponent, {
      data: {
        tipo: 'confirmacao',
        titulo: 'Confirmar Manutenção?',
        mensagem: 'Ao confirmar, a manutenção será registrada.',
        textoConfirmar: 'Confirmar',
        textoCancelar: 'Cancelar'
      } as ModalDados
    });

    dialogRef.afterClosed().subscribe((confirmou) => {
      if (!confirmou) return;
      this.confirmarManutencao();
    });
  }

  cancelarFormulario() {
    this.mostrarFormulario = false;
    this.form.reset();
    this.botaoDesativado = false;
  }

  obterCorDoBadge(estado: string | undefined): string {
    if (!estado) return 'badge-cinza';
    switch (estado.toUpperCase()) {
      case 'APROVADA':
        return 'badge-amarelo';
      case 'REDIRECIONADA':
        return 'badge-roxo';
      case 'ARRUMADA':
        return 'badge-azul';
      default:
        return 'badge-cinza';
    }
  }
}
