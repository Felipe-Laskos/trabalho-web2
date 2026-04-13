import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Solicitacao } from '../../core/models/solicitacao.model';
import { Funcionario } from '../../core/models/funcionario.model';
import { SolicitacaoService } from '../../core/services/solicitacao.service';
import { HistoricoService } from '../../core/services/historico.service';
import { FuncionarioService } from '../../core/services/funcionario.service';
import { AuthService } from '../../core/services/auth.service';
import { SolicitacaoENUM } from '../../core/models/solicitacaoENUM.model';
import { CardVisualizacaoComponent } from '../../shared/card-visualizacao/card-visualizacao.component';
import { BotaoAprovarComponent } from '../../shared/botao-aprovar/botao-aprovar.component';
import { BotaoComponent } from '../../shared/botao/botao.component';
import { ComboComponent, OpcaoCombo } from '../../shared/combo/combo.component';
import { CardInfoComponent } from '../../shared/card-info/card-info.component';
import { ModalGenericoComponent, ModalDados } from '../../shared/modal-generico/modal-generico.component';

@Component({
  selector: 'app-redirecionar-manutencao',
  standalone: true,
  imports: [
    CommonModule,
    CardVisualizacaoComponent,
    BotaoAprovarComponent,
    BotaoComponent,
    ComboComponent,
    CardInfoComponent
  ],
  templateUrl: './redirecionar-manutencao.component.html',
  styleUrl: './redirecionar-manutencao.component.css'
})
export class RedirecionarManutencaoComponent implements OnInit {

  private solicitacaoService = inject(SolicitacaoService);
  private historicoService = inject(HistoricoService);
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
    const res = this.solicitacaoService.buscarPorId(id);
    if (res !== undefined) this.solicitacao = res;

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
      alert('Selecione um funcionário para redirecionar.');
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

      const funcionarioDestino = this.funcionarioService.buscarPorId(this.funcionarioSelecionadoId!);
      const emailLogado = this.authService.getEmail();
      const funcionarioOrigem = this.funcionarioService.buscarPorEmail(emailLogado);

      this.historicoService.inserir({
        dataHora: new Date().toISOString(),
        estadoAnterior: this.solicitacao!.estadoAtual,
        estadoNovo: SolicitacaoENUM.REDIRECIONADA,
        solicitacaoId: this.solicitacao!.id!,
        funcionario: funcionarioOrigem,
        funcionarioDestino: funcionarioDestino,
        observacao: `Redirecionada de ${funcionarioOrigem?.nome} para ${funcionarioDestino?.nome}.`
      });

      this.solicitacao!.estadoAtual = SolicitacaoENUM.REDIRECIONADA;
      this.solicitacao!.funcionarioResponsavel = funcionarioDestino;
      this.solicitacaoService.atualizar(this.solicitacao!);

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
