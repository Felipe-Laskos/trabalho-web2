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
import { HistoricoService } from '../../core/services/historico.service';
import { AuthService } from '../../core/services/auth.service';

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
  private historicoService = inject(HistoricoService);
  private authService = inject(AuthService);

  nomeUsuario: string = 'Cliente';
  listaSolicitacoes: Solicitacao[] = [];
  dadosFiltrados: Solicitacao[] = [];
  dadosExibidos: Solicitacao[] = [];
  idPedidoPendente: string | number = '00000';
  
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
    const emailLogado = this.authService.getEmail();

    this.solicitacaoService.listarTodos().subscribe({ //TODO: Trocar por listarPorCliente(clienteId) apontando para GET /api/solicitacoes/cliente/{clienteId}: JESS
    next: (lista) => {
      this.listaSolicitacoes = lista
        .filter(s => s.cliente?.email === emailLogado)
        .sort((a, b) =>
          new Date(a.dataHoraCriacao).getTime() -
          new Date(b.dataHoraCriacao).getTime()
        );

      this.dadosFiltrados = this.listaSolicitacoes;
      this.identificarUltimoPedidoEmAnalise();
      this.atualizarPaginacao();
    },
    error: () => { //TODO: Trocar por modal de erro: JESS
      this.aviso.open('Erro ao carregar solicitações.', 'OK', {
        duration: 3000,
        verticalPosition: 'top'
      });
    }
  });
}

  onBusca(valor: string) {
    const termo = valor.toLowerCase();
    this.dadosFiltrados = this.listaSolicitacoes.filter(s =>
      s.id?.toString().includes(termo) ||
      s.descricaoEquipamento.toLowerCase().includes(termo) ||
      s.estadoAtual.toLowerCase().includes(termo) ||
      s.dataHoraCriacao?.toLowerCase().includes(termo)
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
    this.router.navigate(['/cliente/visualizar-servico', item.id]);
  }

  aprovar(item: Solicitacao) { this.router.navigate(['/cliente/mostrar-orcamento', item.id]); }
  resgatar(item: Solicitacao) {
    if (confirm(`Deseja resgatar a solicitação do equipamento: ${item.descricaoEquipamento}?`)) {
      this.historicoService.inserir({
        dataHora: new Date().toISOString(),
        estadoAnterior: item.estadoAtual,
        estadoNovo: SolicitacaoENUM.APROVADA,
        solicitacaoId: item.id!,
        observacao: 'Solicitação resgatada pelo cliente.'
      });
      item.estadoAtual = SolicitacaoENUM.APROVADA;

      this.solicitacaoService.resgatar(item.id!).subscribe({
      next: () => {
        this.carregarDadosIniciais();

        this.aviso.open('Solicitação resgatada! Estado alterado para APROVADA.','OK',
          { duration: 3000, verticalPosition: 'top'}
        );
      },
      error: () => { //TODO: Trocar por modal de erro: JESS
        this.aviso.open('Erro ao resgatar solicitação.', 'OK', {
          duration: 3000,
          verticalPosition: 'top'
        });
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