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
import { Solicitacao } from '../../core/models/solicitacao.model';
import { SolicitacaoENUM } from '../../core/models/solicitacaoENUM.model';
import { SolicitacaoService } from '../../core/services/solicitacao.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

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
  private notificationService = inject(NotificationService);

  nomeUsuario: string = 'Cliente';
  listaSolicitacoes: Solicitacao[] = [];
  dadosFiltrados: Solicitacao[] = [];
  dadosExibidos: Solicitacao[] = [];
  idPedidoPendente: string | number = '00000';
  private clienteId?: number;
  private termoBusca = '';

  carregamento = false;
  
  colunasTabela: ColunaTabela[] = [
  { campo: 'id', titulo: 'Ordem', tipo: 'texto' },
  { campo: 'dataHoraCriacao', titulo: 'Data/Hora', tipo: 'data' },
  { campo: 'descricaoEquipamento', titulo: 'Equipamento', tipo: 'texto', truncar: 30 },
  { campo: 'estadoAtual', titulo: 'Situação Atual', tipo: 'estado' },
  { campo: 'acoes', titulo: 'Ações', tipo: 'acao' }
];

  acoesTabela: AcaoTabela[] = [
    { nome: 'Aprovar/Rejeitar', acao: 'aprovar', estados: ['ORCADA'], cor: 'primary' },
    { nome: 'Resgatar', acao: 'resgatar', estados: ['REJEITADA'], cor: 'warn' },
    { nome: 'Pagar', acao: 'pagar', estados: ['ARRUMADA'], cor: 'accent' },
    { nome: 'Visualizar', acao: 'visualizar' }
  ];

  paginaAtual: number = 0;
  itensPorPagina: number = 5;
  totalElements: number = 0;
  totalPaginas: number = 0;

  constructor(public router: Router) {}

  ngOnInit(): void {
    this.carregarDadosIniciais();
  }

  private carregarDadosIniciais(): void {
    this.nomeUsuario = this.authService.getNome() || 'Cliente';
    this.clienteId = this.authService.getId();

    if (!this.clienteId) {
      this.notificationService.exibirAviso('Cliente não autenticado.');
      return;
    }

    this.carregarSolicitacoes();
}

  private carregarSolicitacoes(): void {
    if (!this.clienteId) {
      return;
    }

    this.carregamento = true;

    this.solicitacaoService.listarPorClientePaginado(this.clienteId, this.paginaAtual, this.itensPorPagina).subscribe({
    next: (pagina) => {
      this.listaSolicitacoes = pagina.content;
      this.totalElements = pagina.totalElements;
      this.totalPaginas = pagina.totalPages;
      this.paginaAtual = pagina.number;
      this.aplicarBuscaNaPaginaAtual();
      this.identificarUltimoPedidoEmAnalise();

      this.carregamento = false;
    },
    error: (err) => { 
      this.notificationService.exibirErro(err);
      this.carregamento = false;
    }
  });
}

  onBusca(valor: string) {
    this.termoBusca = valor.toLowerCase();
    this.aplicarBuscaNaPaginaAtual();
  }

  private aplicarBuscaNaPaginaAtual(): void {
    const termo = this.termoBusca;

    if (!termo) {
      this.dadosFiltrados = this.listaSolicitacoes;
      this.dadosExibidos = this.listaSolicitacoes;
      return;
    }

    this.dadosFiltrados = this.listaSolicitacoes.filter(s =>
      s.id?.toString().includes(termo) ||
      s.descricaoEquipamento.toLowerCase().includes(termo) ||
      s.estadoAtual.toLowerCase().includes(termo) ||
      s.dataHoraCriacao?.toLowerCase().includes(termo)
    );
    this.dadosExibidos = this.dadosFiltrados;
  }

  aoMudarPagina(novaPagina: number) {
    this.paginaAtual = novaPagina;
    this.carregarSolicitacoes();
  }

  private identificarUltimoPedidoEmAnalise(): void {
    const pedido = this.listaSolicitacoes.find(s => 
      s.estadoAtual === SolicitacaoENUM.ABERTA || 
      s.estadoAtual === SolicitacaoENUM.ORCADA
    );
    this.idPedidoPendente = pedido?.id ?? '00000';
  }

  tratarVisualizacao(item: Solicitacao): void {
    this.router.navigate(['/cliente/visualizar-servico', item.id]);
  }

  aprovar(item: Solicitacao) { this.router.navigate(['/cliente/mostrar-orcamento', item.id]); }

  resgatar(item: Solicitacao) {
    if (confirm(`Deseja resgatar a solicitação do equipamento: ${item.descricaoEquipamento}?`)) {
      this.carregamento = true;

      this.solicitacaoService.resgatar(item.id!).subscribe({
      next: () => {
        this.carregarSolicitacoes();

        this.notificationService.exibirSucesso('Serviço resgatado com sucesso!')
        this.carregamento = false;
      },
      error: (err) => { 
        this.notificationService.exibirErro(err);
        this.carregamento = false;
      }
    });
  }
}
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
