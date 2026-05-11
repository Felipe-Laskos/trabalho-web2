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
import { Solicitacao } from '../../core/models/solicitacao.model';
import { SolicitacaoENUM } from '../../core/models/solicitacaoENUM.model';
import { SolicitacaoService } from '../../core/services/solicitacao.service';
import { HistoricoService } from '../../core/services/historico.service';
import { FuncionarioService } from '../../core/services/funcionario.service';
import { AuthService } from '../../core/services/auth.service';
import { CardVisualizacaoComponent } from '../../shared/card-visualizacao/card-visualizacao.component';
import { BotaoComponent } from '../../shared/botao/botao.component';
import { TextAreaComponent } from '../../shared/text-area/text-area.component';
import { BotaoAprovarComponent } from '../../shared/botao-aprovar/botao-aprovar.component';
import { BotaoCancelarComponent } from '../../shared/botao-cancelar/botao-cancelar.component';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-efetuar-manutencao',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    CardVisualizacaoComponent,
    BotaoComponent,
    TextAreaComponent,
    BotaoAprovarComponent,
    BotaoCancelarComponent,
  ],
  templateUrl: './efetuar-manutencao.component.html',
  styleUrls: ['./efetuar-manutencao.component.css'],
})
export class EfetuarManutencaoComponent implements OnInit {
  private solicitacaoService = inject(SolicitacaoService);
  private historicoService = inject(HistoricoService);
  private funcionarioService = inject(FuncionarioService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private aviso = inject(MatSnackBar);
  private notificationService = inject(NotificationService);

  solicitacao?: Solicitacao;
  mostrarFormulario = false;
  dataHoraAcesso: Date = new Date();
  exibirModal: boolean = false;
  botaoDesativado: boolean = false;
  exibirToastSucesso: boolean = false;

  estadoModal:
    | 'confirmacao'
    | 'sucesso'
    | 'confirmarRejeicao'
    | 'motivoRejeicao'
    | 'sucessoRejeicao' = 'confirmacao';

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

    const emailLogado = this.authService.getEmail();
    this.funcionarioService.buscarPorEmail(emailLogado).subscribe({
      next: funcionarioLogado => {
        this.historicoService.inserir({
          dataHora: new Date().toISOString(),
          estadoAnterior: this.solicitacao!.estadoAtual,
          estadoNovo: SolicitacaoENUM.ARRUMADA,
          solicitacaoId: this.solicitacao!.id!,
          funcionario: funcionarioLogado,
          observacao: `Manutenção realizada. Descrição: ${descricao}`,
        }).subscribe();

        this.solicitacao!.estadoAtual = SolicitacaoENUM.ARRUMADA;
        this.solicitacao!.descricaoManutencao = descricao;
        this.solicitacao!.orientacoesCliente = orientacoes;
        this.solicitacao!.funcionarioResponsavel = funcionarioLogado;

        this.solicitacaoService.efetuarManutencao(this.solicitacao!.id!, {
          descricaoManutencao: descricao,
          orientacoesCliente: orientacoes,
        }).subscribe({
          next: () => {
            this.form.reset();
            this.exibirModal = false;
            this.estadoModal = 'confirmacao';
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
      },
      error: (err) => {
        this.notificationService.exibirErro(err);
      }
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

  fecharModal() {
    this.exibirModal = false;
    this.estadoModal = 'confirmacao';

    if (!this.exibirToastSucesso) {
      this.botaoDesativado = false;
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
    this.estadoModal = 'confirmacao';
    this.exibirModal = true;
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
