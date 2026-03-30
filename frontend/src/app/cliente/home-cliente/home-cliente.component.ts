import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BotaoAprovarComponent } from '../../shared/botao-aprovar/botao-aprovar.component';
import { InputComponent } from '../../shared/input/input.component';
import { PaginacaoComponent } from '../../shared/paginacao/paginacao.component';
import { CardVisualizacaoComponent } from "../../shared/card-visualizacao/card-visualizacao.component";
import { TabelaComponent, AcaoTabela, EventoAcao, ColunaTabela } from "../../shared/tabela/tabela.component";
import { Solicitacao } from '../../models/solicitacao.model';
import { SolicitacaoENUM } from '../../models/solicitacaoENUM.model';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home-cliente',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatSnackBarModule,
    BotaoAprovarComponent,
    InputComponent,
    PaginacaoComponent,
    CardVisualizacaoComponent,
    TabelaComponent
  ],
  templateUrl: './home-cliente.component.html',
  styleUrls: ['./home-cliente.component.css']
})
export class HomeClienteComponent implements OnInit {
  private solicitacaoService = inject(SolicitacaoService);
  private authService = inject(AuthService);

  nomeUsuario: string = 'Cliente';
  listaSolicitacoes: Solicitacao[] = [];
  dadosFiltrados: Solicitacao[] = [];
  dadosExibidos: Solicitacao[] = [];
  idPedidoPendente: string | number = '00000';
  
  colunasTabela: ColunaTabela[] = [
  { campo: 'id', titulo: 'Ordem', tipo: 'texto' },
  { campo: 'descricaoEquipamento', titulo: 'Aparelho', tipo: 'texto' },
  { campo: 'estadoAtual', titulo: 'Situação Atual', tipo: 'estado' },
  { campo: 'valorOrcado', titulo: 'Valor Previsto', tipo: 'texto' },
  { campo: 'acoes', titulo: 'Ações', tipo: 'acao' }
];

  acoesTabela: AcaoTabela[] = [
    { nome: 'Aprovar', acao: 'aprovar', estados: ['ORCADA'], cor: 'primary' },
    { nome: 'Resgatar', acao: 'resgatar', estados: ['REJEITADA'], cor: 'warn' },
    { nome: 'Pagar', acao: 'pagar', estados: ['ARRUMADA'], cor: 'accent' },
    { nome: 'Visualizar', acao: 'visualizar' }
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
    this.nomeUsuario = this.authService.getNome() || 'Cliente';
    this.listaSolicitacoes = this.solicitacaoService.listarTodos();
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

  aprovar(item: Solicitacao) { this.router.navigate(['/cliente/mostrar-orcamento', item.id]); }
  resgatar(item: Solicitacao) { console.log('Resgatar pedido:', item.id); } // RF009 Laura
  pagar(item: Solicitacao) { this.router.navigate(['/cliente/pagar', item.id]); } // RF010 Laura

  irParaSolicitacao(): void {
    this.router.navigate(['/cliente/solicitar-manutencao']);
  }

  aoClicarAcaoTabela(evento: EventoAcao) {
    if (evento.acao === 'aprovar') {
      this.aprovar(evento.item);
    } else if (evento.acao === 'resgatar') {
      this.resgatar(evento.item);
    } else if (evento.acao === 'pagar') {
      this.pagar(evento.item);
    } else if (evento.acao === 'visualizar') {
      this.tratarVisualizacao(evento.item);
    }
  }
}