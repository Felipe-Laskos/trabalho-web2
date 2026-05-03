import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Solicitacao } from '../../core/models/solicitacao.model';
import { Funcionario } from '../../core/models/funcionario.model';
import { SolicitacaoService } from '../../core/services/solicitacao.service';
import { FuncionarioService } from '../../core/services/funcionario.service';
import { AuthService } from '../../core/services/auth.service';
import { CardVisualizacaoComponent } from '../../shared/card-visualizacao/card-visualizacao.component';
import { BotaoAprovarComponent } from '../../shared/botao-aprovar/botao-aprovar.component';
import { BotaoComponent } from '../../shared/botao/botao.component';
import { ComboComponent, OpcaoCombo } from '../../shared/combo/combo.component';
import { CardInfoComponent } from '../../shared/card-info/card-info.component';
import {
  ModalGenericoComponent,
  ModalDados,
} from '../../shared/modal-generico/modal-generico.component';

@Component({
  selector: 'app-redirecionar-manutencao',
  standalone: true,
  imports: [
    CommonModule,
    CardVisualizacaoComponent,
    BotaoAprovarComponent,
    BotaoComponent,
    ComboComponent,
    CardInfoComponent,
  ],
  templateUrl: './redirecionar-manutencao.component.html',
  styleUrl: './redirecionar-manutencao.component.css',
})
export class RedirecionarManutencaoComponent implements OnInit {
  private solicitacaoService = inject(SolicitacaoService);
  private funcionarioService = inject(FuncionarioService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  solicitacao?: Solicitacao;
  funcionarios: Funcionario[] = [];
  opcoesCombo: OpcaoCombo[] = [];
  funcionarioSelecionadoId: number | null = null;

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
    
    this.solicitacaoService.buscarPorId(id).subscribe({
      next: (res) => {
        this.solicitacao = res;
      },
      error: () => {
        // Alterado para modal de erro
        const erroRef = this.dialog.open(ModalGenericoComponent, {
          data: {
            tipo: 'confirmacao',
            titulo: 'Erro',
            mensagem: 'Não foi possível carregar a solicitação.',
            textoConfirmar: 'OK',
            textoCancelar: ''
          } as ModalDados
        });

        erroRef.afterClosed().subscribe(() => {
          this.router.navigate(['/funcionario']);
        });
      }
    });

    this.funcionarios = this.funcionarioService.listarAtivos();

    const emailLogado = this.authService.getEmail();
    const funcionarioLogado = this.funcionarioService.buscarPorEmail(emailLogado);

    this.opcoesCombo = this.funcionarios
      .filter(f => f.id !== funcionarioLogado?.id)
      .map(f => ({
        value: f.id!,
        viewValue: f.nome
      }));
  }

  onFuncionarioSelecionado(valor: string | number): void {
    this.funcionarioSelecionadoId = Number(valor);
  }

  redirecionarManutencao(): void {
    if (!this.solicitacao || !this.funcionarioSelecionadoId) {
      this.dialog.open(ModalGenericoComponent, {
        data: {
          tipo: 'confirmacao',
          titulo: 'Atenção',
          mensagem: 'Selecione um funcionário para redirecionar.',
          textoConfirmar: 'Ok',
          textoCancelar: ''
        } as ModalDados
      });
      return;
    }

    const nomeFuncionario = this.getNomeFuncionarioDestino();

    const dialogRef = this.dialog.open(ModalGenericoComponent, {
      data: {
        tipo: 'confirmacao',
        titulo: 'Confirmar Redirecionamento?',
        mensagem: `A solicitação será redirecionada para ${nomeFuncionario}.`,
        textoConfirmar: 'Sim, Redirecionar',
        textoCancelar: 'Cancelar'
      } as ModalDados
    });

    dialogRef.afterClosed().subscribe(confirmou => {
      if (!confirmou) return;

      // Ajustado para consumir da API usando a assinatura ajustada
      this.solicitacaoService.redirecionar(
        this.solicitacao!.id!, 
        this.funcionarioSelecionadoId!
      ).subscribe({
        next: (solicitacaoAtualizada) => {
          this.solicitacao = solicitacaoAtualizada;

          const sucessoRef = this.dialog.open(ModalGenericoComponent, {
            data: {
              tipo: 'confirmacao',
              titulo: 'Redirecionado!',
              mensagem: `A solicitação #${this.solicitacao!.id} foi redirecionada para ${nomeFuncionario}.`,
              textoConfirmar: 'Ok',
              textoCancelar: ''
            } as ModalDados
          });

          sucessoRef.afterClosed().subscribe(() => {
            this.router.navigate(['/funcionario']);
          });

        },
        error: (erro) => {
          this.dialog.open(ModalGenericoComponent, {
            data: {
              tipo: 'confirmacao',
              titulo: 'Erro no Redirecionamento',
              mensagem: erro.error?.message || 'Ocorreu um erro de comunicação com o servidor.',
              textoConfirmar: 'Ok',
              textoCancelar: ''
            } as ModalDados
          });
        }
      });
    });
  }

  voltar(): void {
    if (!this.solicitacao) {
      this.router.navigate(['/funcionario']);
      return;
    }
    this.router.navigate(['/funcionario/efetuar-manutencao', this.solicitacao.id]);
  }

  getNomeFuncionarioDestino(): string {
    if (!this.funcionarioSelecionadoId) return '';
    const f = this.funcionarios.find(func => func.id === this.funcionarioSelecionadoId);
    return f ? f.nome : '';
  }
}