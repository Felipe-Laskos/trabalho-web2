import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../shared/input/input.component';
import { CardVisualizacaoComponent } from '../../shared/card-visualizacao/card-visualizacao.component';
import { BotaoComponent } from '../../shared/botao/botao.component';
import { AuthService } from '../../services/auth.service';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { HistoricoService } from '../../services/historico.service';
import { FuncionarioService } from '../../services/funcionario.service';
import { Solicitacao } from '../../models/solicitacao.model';
import { SolicitacaoENUM } from '../../models/solicitacaoENUM.model';
import { MatDialog } from '@angular/material/dialog';
import { ModalGenericoComponent, ModalDados } from '../../shared/modal-generico/modal-generico.component';


@Component({
  selector: 'app-efetuar-orcamento',
  standalone: true,
  imports: [CommonModule, FormsModule, CardVisualizacaoComponent, InputComponent, BotaoComponent],
  templateUrl: './efetuar-orcamento.component.html',
  styleUrls: ['./efetuar-orcamento.component.css']
})
export class EfetuarOrcamentoComponent implements OnInit {

  private solicitacaoService = inject(SolicitacaoService);
  private historicoService = inject(HistoricoService);
  private funcionarioService = inject(FuncionarioService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  solicitacao?: Solicitacao;
  valorOrcamento: number = 0;
  nomeFuncionario: string = '';
  valorDigitado: string = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.solicitacao = this.solicitacaoService.buscarPorId(id);
    this.nomeFuncionario = this.authService.getNome();
  }

  valorValido(): boolean {
    const v = parseFloat(this.valorDigitado);
    return !isNaN(v) && v > 0;
  }

  formatarData(date: Date): string {
    const d = date;
    const dia = String(d.getDate()).padStart(2,'0');
    const mes = String(d.getMonth()+1).padStart(2,'0');
    const ano = d.getFullYear();
    const hora = String(d.getHours()).padStart(2,'0');
    const min = String(d.getMinutes()).padStart(2,'0');
    return `${dia}/${mes}/${ano} ${hora}:${min}`;
  }

  registrarOrcamento(): void {
    if (!this.solicitacao) return;

    this.valorOrcamento = parseFloat(this.valorDigitado);

    if (isNaN(this.valorOrcamento) || this.valorOrcamento <= 0) {
      const dadosModal: ModalDados = {
        tipo: 'confirmacao',
        titulo: 'Valor Inválido',
        mensagem: 'Digite um valor válido para o orçamento.',
        textoConfirmar: 'OK'
      };
      this.dialog.open(ModalGenericoComponent, { data: dadosModal });
      return;
    }

    const emailLogado = this.authService.getEmail();
    const funcionarioLogado = this.funcionarioService.buscarPorEmail(emailLogado);

    this.historicoService.inserir({
      dataHora: new Date().toISOString(),
      estadoAnterior: this.solicitacao.estadoAtual,
      estadoNovo: SolicitacaoENUM.ORCADA,
      solicitacaoId: this.solicitacao.id!,
      funcionario: funcionarioLogado,
      observacao: `Orçamento de R$ ${this.valorOrcamento.toFixed(2)} registrado.`
    });

    this.solicitacao.funcionarioOrcamento = this.authService.getNome();
    this.solicitacao.dataHoraOrcamento = new Date().toISOString();
    this.solicitacao.valorOrcado = this.valorOrcamento;
    this.solicitacao.estadoAtual = SolicitacaoENUM.ORCADA;

    this.solicitacaoService.atualizar(this.solicitacao);

    const dialogRef = this.dialog.open(ModalGenericoComponent, {
      data: {
        tipo: 'confirmacao',
        titulo: 'Orçamento Registrado',
        mensagem: `Funcionário: ${this.solicitacao?.funcionarioOrcamento} - Data/Hora: ${this.formatarData(new Date(this.solicitacao!.dataHoraOrcamento!))}`,
        textoConfirmar: 'OK'
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/funcionario']);
    });
  }
}
