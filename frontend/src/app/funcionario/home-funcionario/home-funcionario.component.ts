import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Solicitacao } from '../../models/solicitacao.model';
import { SolicitacaoENUM } from '../../models/solicitacaoENUM.model';
import { Router } from '@angular/router';
import { CardVisualizacaoComponent } from '../../shared/card-visualizacao/card-visualizacao.component';
import { TabelaComponent, ColunaTabela, AcaoTabela } from '../../shared/tabela/tabela.component';
import { PaginacaoComponent } from '../../shared/paginacao/paginacao.component';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-home-funcionario',
  standalone: true,
  imports: [CommonModule, CardVisualizacaoComponent, TabelaComponent, PaginacaoComponent],
  templateUrl: './home-funcionario.component.html',
  styleUrl: './home-funcionario.component.css'
})
export class HomeFuncionarioComponent implements OnInit {

  private solicitacaoService = inject(SolicitacaoService);
  private authService = inject(AuthService);
  private router = inject(Router);

  nomeFuncionario: string = '';
  solicitacoesAbertas: Solicitacao[] = [];

  colunas: ColunaTabela[] = [
    { campo: 'dataHoraCriacao', titulo: 'Data/Hora da Solicitação', tipo: 'data' },
    { campo: 'cliente.nome', titulo: 'Cliente', tipo: 'nome' },
    { campo: 'descricaoEquipamento', titulo: 'Descrição do Produto', truncar: 30 },
    { campo: 'acao', titulo: '-', tipo: 'acao' }
  ];

  acoes: AcaoTabela[] = [
    {
      nome: 'Efetuar Orçamento',
      acao: 'orcamento',
      cor: 'primary',
      estados: [SolicitacaoENUM.ABERTA]
    }
  ];

  paginaAtual = 1;
  itensPorPagina = 5;

  ngOnInit(): void {
    this.nomeFuncionario = this.authService.getNome();
    this.carregarSolicitacoes();
  }

  private carregarSolicitacoes(): void {
    this.solicitacoesAbertas = this.solicitacaoService.listarTodos()
      .filter(s => s.estadoAtual === SolicitacaoENUM.ABERTA)
      .sort((a, b) => new Date(a.dataHoraCriacao).getTime() - new Date(b.dataHoraCriacao).getTime());
  }

  get dadosPaginados() {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    return this.solicitacoesAbertas.slice(inicio, fim);
  }

  onAcaoTabela(evento: any) {
    if (evento.acao === 'orcamento') {
      this.efetuarOrcamento(evento.item.id);
    }
  }

  efetuarOrcamento(id?: number) {
    this.router.navigate(['/funcionario/efetuar-orcamento', id]);
  }

  onPaginaMudou(pagina: any) {
    this.paginaAtual = Number(pagina);
  }
}
