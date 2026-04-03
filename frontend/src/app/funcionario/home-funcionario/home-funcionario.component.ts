import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Solicitacao } from '../../models/solicitacao.model';
import { SolicitacaoENUM } from '../../models/solicitacaoENUM.model';
import { Router } from '@angular/router';
import { CardVisualizacaoComponent } from '../../shared/card-visualizacao/card-visualizacao.component';
import { TabelaComponent, ColunaTabela, AcaoTabela } from '../../shared/tabela/tabela.component';
import { PaginacaoComponent } from '../../shared/paginacao/paginacao.component';
import { mockSolicitacao } from '../../mocks/solicitacao.mock';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-home-funcionario',
  standalone: true,
  imports: [CommonModule, CardVisualizacaoComponent, TabelaComponent, PaginacaoComponent],
  templateUrl: './home-funcionario.component.html',
  styleUrl: './home-funcionario.component.css'
})
export class HomeFuncionarioComponent {

  constructor(private router: Router, private authService: AuthService) {}
  nomeFuncionario: string = this.authService.getNome();
  
  solicitacoes: Solicitacao[] = mockSolicitacao;
    
  get solicitacoesAbertas() {
    return this.solicitacoes.filter(s => s.estadoAtual === SolicitacaoENUM.ABERTA);
  }

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

  onAcaoTabela(evento: any) {
    if (evento.acao === 'orcamento') {
      this.efetuarOrcamento(evento.item.id);
    }
  }

  efetuarOrcamento(id?: number) {
    this.router.navigate(['/funcionario/efetuar-orcamento', id]);
  }

  paginaAtual = 1;
itensPorPagina = 5;

get dadosPaginados() {
  const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
  const fim = inicio + this.itensPorPagina;
  return this.solicitacoesAbertas.slice(inicio, fim);
}

onPaginaMudou(pagina: any) {
  this.paginaAtual = Number(pagina);
}
}