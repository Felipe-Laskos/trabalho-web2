import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BotaoAprovarComponent } from '../../shared/botao-aprovar/botao-aprovar.component';
import { InputComponent } from '../../shared/input/input.component';
import { PaginacaoComponent } from '../../shared/paginacao/paginacao.component';
import { mockSolicitacao } from '../../mocks/solicitacao.mock';
import { Solicitacao } from '../../models/solicitacao.model';
import { SolicitacaoENUM } from '../../models/solicitacaoENUM.model';
import { CardVisualizacaoComponent } from "../../shared/card-visualizacao/card-visualizacao.component";

@Component({
  selector: 'app-home-cliente',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSnackBarModule,
    BotaoAprovarComponent,
    InputComponent,
    PaginacaoComponent,
    CardVisualizacaoComponent
],
  templateUrl: './home-cliente.component.html',
  styleUrls: ['./home-cliente.component.css']
})
export class HomeClienteComponent implements OnInit {
  nomeUsuario: string = 'Cliente';
  listaSolicitacoes: Solicitacao[] = mockSolicitacao;
  dadosFiltrados: Solicitacao[] = [];
  dadosExibidos: Solicitacao[] = [];
  idPedidoPendente: string | number = '00000';
  
  colunas: string[] = [
    'aparelho', 
    'situacao', 
    'valor', 
    'acoes'
  ];
  paginaAtual: number = 1;
  itensPorPagina: number = 5;

  constructor(public router: Router, private aviso: MatSnackBar) {}

  ngOnInit(): void {
    this.carregarDadosIniciais();
    this.dadosFiltrados = this.listaSolicitacoes;
    this.atualizarPaginacao();
  }

  private carregarDadosIniciais(): void {
    this.nomeUsuario = localStorage.getItem('usuarioSessao') || 'Cliente';
    this.identificarUltimoPedidoEmAnalise();
  }

  onBusca(valor: string) {
    const termo = valor.toLowerCase();
    this.dadosFiltrados = this.listaSolicitacoes.filter(s => 
      s.descricaoEquipamento.toLowerCase().includes(termo) || 
      s.estadoAtual.toLowerCase().includes(termo)
    );
    
    this.paginaAtual = 1;
    this.atualizarPaginacao();
  }

  atualizarPaginacao(): void {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.dadosExibidos = this.dadosFiltrados.slice(inicio, fim);
  }

  aoMudarPagina(novaPagina: number) {
    this.paginaAtual = novaPagina;
    this.atualizarPaginacao();
  }

  private identificarUltimoPedidoEmAnalise(): void {
    const pedido = this.listaSolicitacoes.find(s => 
      s.estadoAtual === SolicitacaoENUM.ABERTA || 
      s.estadoAtual === SolicitacaoENUM.ORCADA
    );
    this.idPedidoPendente = pedido?.id ?? '00000';
  }

  tratarVisualizacao(item: Solicitacao): void {
    if (item.estadoAtual === SolicitacaoENUM.ORCADA) {
      this.router.navigate(['/cliente/mostrar-orcamento', item.id]);
    } else {
      this.aviso.open('Esta solicitação ainda está em análise técnica.', 'OK', {
        duration: 3000,
        verticalPosition: 'top'
      });
    }
  }

  irParaSolicitacao(): void {
    this.router.navigate(['/cliente/solicitar-manutencao']);
  }
}