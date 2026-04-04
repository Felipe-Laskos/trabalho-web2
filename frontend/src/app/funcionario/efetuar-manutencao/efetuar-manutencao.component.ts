import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Solicitacao } from '../../models/solicitacao.model';
import { SolicitacaoENUM } from '../../models/solicitacaoENUM.model';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { HistoricoService } from '../../services/historico.service';
import { FuncionarioService } from '../../services/funcionario.service';
import { AuthService } from '../../services/auth.service';
import { CardVisualizacaoComponent } from '../../shared/card-visualizacao/card-visualizacao.component';
import { BotaoComponent } from '../../shared/botao/botao.component';

@Component({
  selector: 'app-efetuar-manutencao',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule, CardVisualizacaoComponent, BotaoComponent],
  templateUrl: './efetuar-manutencao.component.html',
  styleUrls: ['./efetuar-manutencao.component.css']
})
export class EfetuarManutencaoComponent implements OnInit {

  private solicitacaoService = inject(SolicitacaoService);
  private historicoService = inject(HistoricoService);
  private funcionarioService = inject(FuncionarioService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private aviso = inject(MatSnackBar);

  solicitacao?: Solicitacao;
  mostrarFormulario = false;

  form = new FormGroup({
    descricao: new FormControl(''),
    orientacoes: new FormControl('')
  });

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
    const res = this.solicitacaoService.buscarPorId(id);

    if (res && (res.estadoAtual === SolicitacaoENUM.APROVADA || res.estadoAtual === SolicitacaoENUM.REDIRECIONADA)) {
      this.solicitacao = res;
    } else {
      this.aviso.open('Solicitação não encontrada ou não está disponível para manutenção.', 'OK', { duration: 3000 });
      this.router.navigate(['/funcionario/visualizar-solicitacoes']);
    }
  }

  abrirFormulario(): void {
    this.mostrarFormulario = true;
  }

  confirmarManutencao(): void {
    const dados = this.form.value;

    if (!dados.descricao || !dados.orientacoes) {
      this.aviso.open('Preencha todos os campos!', 'OK', { duration: 3000, verticalPosition: 'top' });
      return;
    }

    if (!this.solicitacao) return;

    const emailLogado = this.authService.getEmail();
    const funcionarioLogado = this.funcionarioService.buscarPorEmail(emailLogado);

    this.historicoService.inserir({
      dataHora: new Date().toISOString(),
      estadoAnterior: this.solicitacao.estadoAtual,
      estadoNovo: SolicitacaoENUM.ARRUMADA,
      solicitacaoId: this.solicitacao.id!,
      funcionario: funcionarioLogado,
      observacao: `Manutenção realizada. Descrição: ${dados.descricao}`
    });

    this.solicitacao.estadoAtual = SolicitacaoENUM.ARRUMADA;
    this.solicitacao.descricaoManutencao = dados.descricao;
    this.solicitacao.orientacoesCliente = dados.orientacoes;
    this.solicitacao.funcionarioResponsavel = funcionarioLogado;
    this.solicitacaoService.atualizar(this.solicitacao);

    this.aviso.open('Manutenção realizada com sucesso!', 'OK', { duration: 3000, verticalPosition: 'top' });
    this.router.navigate(['/funcionario']);
  }

  redirecionar(): void {
    if (this.solicitacao) {
      this.router.navigate(['/funcionario/redirecionar-manutencao', this.solicitacao.id]);
    }
  }
}
