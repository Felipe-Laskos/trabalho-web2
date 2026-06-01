import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriaEquipamento } from '../../core/models/categoria.model';
import { CategoriaService } from '../../core/services/categoria.service';
import { TabelaComponent } from '../../shared/tabela/tabela.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModalGenericoComponent } from '../../shared/modal-generico/modal-generico.component';
import { BotaoComponent } from '../../shared/botao/botao.component';
import { PaginacaoComponent } from '../../shared/paginacao/paginacao.component';
import { PesquisaComponent } from '../../shared/pesquisa/pesquisa.component';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-crud-categoria',
  standalone: true,
  imports: [
    CommonModule,
    TabelaComponent,
    MatDialogModule,
    BotaoComponent,
    PaginacaoComponent,
    PesquisaComponent
  ],
  templateUrl: './crud-categoria.component.html',
  styleUrls: ['./crud-categoria.component.css']
})
export class CrudCategoriaComponent implements OnInit {

  private categoriaService = inject(CategoriaService);
  private dialog = inject(MatDialog);
  private notificationService = inject(NotificationService);

  colunas = [
    { campo: 'id', titulo: 'ID' },
    { campo: 'nome', titulo: 'Nome' },
  ];

  dados: CategoriaEquipamento[] = [];
  categoriaSelecionada?: CategoriaEquipamento;
  categoriasFiltradas: CategoriaEquipamento[] = [];

  paginaAtual: number = 0;
  itensPorPagina: number = 10;
  mostrarApenasAtivas: boolean = true;
  termoPesquisa: string = '';
  totalPaginas: number = 0;
  totalElements: number = 0;
  mostrarInativas: boolean = false;

  ngOnInit(): void {
    this.carregarDados();
  }

  private carregarDados(): void {
    const requisicao =
      this.mostrarInativas
      ? this.categoriaService
          .listarInativas(
            this.paginaAtual,
            this.itensPorPagina
          )
      : this.categoriaService
        .listarAtivas(
          this.paginaAtual,
          this.itensPorPagina
      );
      
    requisicao.subscribe({
      next: (response) => {
        this.dados = response.content;
        this.totalPaginas = response.totalPages;
        this.totalElements = response.totalElements;
        this.paginaAtual = response.number;
        this.atualizarFiltro();
      }
    });
  }

  private atualizarFiltro(): void {
    const termo = (this.termoPesquisa ?? '').toLowerCase().trim();

    if (!this.dados) {
      this.categoriasFiltradas = [];
      return;
    }

    if (termo === '') {
      this.categoriasFiltradas = [...this.dados];
      return;
    }

    this.categoriasFiltradas = this.dados.filter(c =>
      (c.nome ?? '').toLowerCase().includes(termo) ||
      c.id?.toString().includes(termo)
    );
  }

  selecionarPagina(pagina: number): void {
    this.paginaAtual = pagina;
    this.carregarDados();
  }

  pesquisar(termo: string): void {
    this.termoPesquisa = termo;
    this.atualizarFiltro();
  }

  toggleInativas(): void {
    this.mostrarInativas = !this.mostrarInativas;
    this.paginaAtual = 0;
    this.carregarDados();
  }

  selecionarLinha(item: any): void {
    this.categoriaSelecionada = item;
  }

  adicionar(): void {
    const dialogRef = this.dialog.open(ModalGenericoComponent, {
      data: {
        tipo: 'formulario',
        titulo: 'Adicionar Categoria',
        campos: [
          { label: 'Nome', campo: 'nome', tipo: 'text', obrigatorio: true }
        ],
        formData: {
          nome: '',
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const nova: CategoriaEquipamento = {
          ...result,
          ativo: true
        };
        this.categoriaService.inserir(nova).subscribe(() => this.carregarDados());
      }
    });
  }

  atualizar(): void {
    if (!this.categoriaSelecionada) return;

    const dialogRef = this.dialog.open(ModalGenericoComponent, {
      data: {
        tipo: 'formulario',
        titulo: 'Editar Categoria',
        campos: [
          { label: 'Nome', campo: 'nome', tipo: 'text' },
        ],
        formData: { ...this.categoriaSelecionada }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.categoriaSelecionada) {
        const atualizada: CategoriaEquipamento = {
          ...this.categoriaSelecionada,
          ...result,
          ativo: true
        };
        this.categoriaService.atualizar(atualizada).subscribe(() => {
          this.carregarDados();
          this.categoriaSelecionada = undefined;
        });
      }
    });
  }

  excluir(): void {
    if (!this.categoriaSelecionada) return;

    const categoria = this.categoriaSelecionada;

    const dialogRef = this.dialog.open(ModalGenericoComponent, {
      data: {
        tipo: 'confirmacao',
        titulo: 'Confirmar Exclusão',
        mensagem: 'Tem certeza que deseja desativar esta categoria?',
        textoConfirmar: 'Sim',
        textoCancelar: 'Não'
      }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.categoriaService.remover(categoria.id!).subscribe(() => {
          this.carregarDados();
          this.categoriaSelecionada = undefined;
        });
      }
    });
  }

  reativar(): void {
    if (!this.categoriaSelecionada) return;

    this.categoriaService
      .reativar(
        this.categoriaSelecionada.id!
      )
      .subscribe(() => {

        this.notificationService
          .exibirSucesso(
            'Categoria reativada.'
          );

        this.carregarDados();

        this.categoriaSelecionada =
          undefined;
      });
  }
}
