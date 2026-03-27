import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Solicitacao } from '../../models/solicitacao.model';
import { Funcionario } from '../../models/funcionario.model';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { FuncionarioService } from '../../services/funcionario.service';
import { AuthService } from '../../services/auth.service';
import { SolicitacaoENUM } from '../../models/solicitacaoENUM.model';
import { CardVisualizacaoComponent } from '../../shared/card-visualizacao/card-visualizacao.component';
import { BotaoAprovarComponent } from '../../shared/botao-aprovar/botao-aprovar.component';
import { BotaoComponent } from '../../shared/botao/botao.component';
import { ComboComponent, OpcaoCombo } from '../../shared/combo/combo.component';
import { CardInfoComponent } from '../../shared/card-info/card-info.component';

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
  private funcionarioService = inject(FuncionarioService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  solicitacao?: Solicitacao;
  funcionarios: Funcionario[] = [];
  opcoesCombo: OpcaoCombo[] = [];
  funcionarioSelecionadoId: number | null = null;

  exibirModal: boolean = false;
  estadoModal: 'confirmacao' | 'sucesso' = 'confirmacao';

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
    const res = this.solicitacaoService.buscarPorId(id);
    if (res !== undefined) this.solicitacao = res;

    this.funcionarios = this.funcionarioService.listarTodos();

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
    this.estadoModal = 'confirmacao';
    this.exibirModal = true;
  }

  confirmarRedirecionamento(): void {
    if (!this.solicitacao || !this.funcionarioSelecionadoId) return;

    const funcionarioDestino = this.funcionarioService.buscarPorId(this.funcionarioSelecionadoId);

    this.solicitacao.estadoAtual = SolicitacaoENUM.REDIRECIONADA;
    this.solicitacao.funcionarioResponsavel = funcionarioDestino;

    this.solicitacaoService.atualizar(this.solicitacao);
    this.estadoModal = 'sucesso';
  }

  fecharModal(): void {
    this.exibirModal = false;
    if (this.estadoModal === 'sucesso') {
      this.router.navigate(['/funcionario']);
    }
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
