import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Solicitacao } from '../../core/models/solicitacao.model';
import { SolicitacaoENUM } from '../../core/models/solicitacaoENUM.model';
import { Router } from '@angular/router';
import { CardVisualizacaoComponent } from '../../shared/card-visualizacao/card-visualizacao.component';
import { TabelaComponent, ColunaTabela, AcaoTabela } from '../../shared/tabela/tabela.component';
import { PaginacaoComponent } from '../../shared/paginacao/paginacao.component';
import { SolicitacaoService } from '../../core/services/solicitacao.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';


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
  private notificationService = inject(NotificationService);

  estadoFiltro = SolicitacaoENUM.ABERTA;
  paginaAtual = 0;
  itensPorPagina = 5;
  totalElements = 0;
  
  nomeFuncionario: string = '';
  solicitacoesAbertas: Solicitacao[] = [];

  colunas: ColunaTabela[] = [
    { campo: 'dataHoraCriacao', titulo: 'Data/Hora da Solicitação', tipo: 'data' },
    { campo: 'cliente.nome', titulo: 'Cliente', tipo: 'nome' },
    { campo: 'descricaoEquipamento', titulo: 'Equipamento', truncar: 30 },
    { campo: 'estadoAtual', titulo: 'Status', tipo: 'estado' },
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

  ngOnInit(): void {
    this.nomeFuncionario = this.authService.getNome();
    this.carregarSolicitacoes();
  }
  
  private carregarSolicitacoes(): void {
        this.solicitacaoService.listarPorPagina(this.estadoFiltro, this.paginaAtual, this.itensPorPagina)
          .subscribe({
            next: (pageData) => {
              this.solicitacoesAbertas = pageData.content;
              this.totalElements = pageData.totalElements;
              this.paginaAtual = pageData.number;
      },
      error: (err) => {
      this.notificationService.exibirErro(err);
      }
    });
  }

  onAcaoTabela(evento: any) {
    if (evento.acao === 'orcamento') {
      this.efetuarOrcamento(evento.item.id);
    }
  }

  efetuarOrcamento(id?: number) {
    this.router.navigate(['/funcionario/efetuar-orcamento', id]);
  }

  onPaginaMudou(novaPaginaZeroBased: number) {
    this.paginaAtual = novaPaginaZeroBased;
    this.carregarSolicitacoes();
  }
}
