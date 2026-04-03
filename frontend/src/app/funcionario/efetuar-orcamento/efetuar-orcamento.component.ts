import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../shared/input/input.component';
import { CardVisualizacaoComponent } from '../../shared/card-visualizacao/card-visualizacao.component';
import { BotaoComponent } from '../../shared/botao/botao.component';
import { AuthService } from '../../services/auth.service';
import { Solicitacao } from '../../models/solicitacao.model';
import { SolicitacaoENUM } from '../../models/solicitacaoENUM.model';
import { MatDialog } from '@angular/material/dialog';
import { ModalGenericoComponent, ModalDados } from '../../shared/modal-generico/modal-generico.component';
import { Router } from '@angular/router';
import { mockSolicitacao } from '../../mocks/solicitacao.mock';



@Component({
  selector: 'app-efetuar-orcamento',
  standalone: true,
  imports: [CommonModule, FormsModule, CardVisualizacaoComponent, InputComponent, BotaoComponent],
  templateUrl: './efetuar-orcamento.component.html',
  styleUrls: ['./efetuar-orcamento.component.css'] 
})
export class EfetuarOrcamentoComponent {

  solicitacao?: Solicitacao;
  solicitacoes: Solicitacao[] = mockSolicitacao;

  valorOrcamento: number = 0;
  nomeFuncionario: string = '';

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

ngOnInit() {
  const id = Number(this.route.snapshot.paramMap.get('id'));
  this.solicitacao = this.solicitacoes.find(s => s.id === id);

  this.nomeFuncionario = this.authService.getNome();
}

valorOrcado: number = 0;   
valorDigitado: string = '';   
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

registrarOrcamento() {
  if (!this.solicitacao) return;

  this.valorOrcamento = parseFloat(this.valorDigitado);

if (isNaN(this.valorOrcamento) || this.valorOrcamento <= 0) {

  const dadosModal: ModalDados = {
    tipo: 'confirmacao',
    titulo: 'Valor Inválido',
    mensagem: 'Digite um valor válido para o orçamento.',
    textoConfirmar: 'OK'
  };

  this.dialog.open(ModalGenericoComponent, {
    data: dadosModal
  });

  return;
}

  this.solicitacao.valorOrcado = this.valorOrcamento;
  this.solicitacao.estadoAtual = SolicitacaoENUM.ORCADA;
  this.solicitacao.funcionarioOrcamento = this.authService.getNome();
  this.solicitacao.dataHoraOrcamento = new Date().toISOString();

  const dialogRef = this.dialog.open(ModalGenericoComponent, {
    data: {
      tipo: 'confirmacao',
      titulo: 'Orçamento Registrado',
      mensagem: `Funcionário: ${this.solicitacao.funcionarioOrcamento}     Data/Hora: ${this.formatarData(new Date(this.solicitacao.dataHoraOrcamento))}`,
      textoConfirmar: 'OK'
    } as ModalDados
  });

  dialogRef.afterClosed().subscribe((result: boolean) => {
    if (result) {
      this.router.navigate(['/funcionario']);
    }
  });
}
}


