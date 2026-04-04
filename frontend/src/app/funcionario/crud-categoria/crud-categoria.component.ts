import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriaEquipamento } from '../../models/categoria.model';
import { CategoriaService } from '../../services/categoria.service';
import { TabelaComponent } from '../../shared/tabela/tabela.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModalGenericoComponent } from '../../shared/modal-generico/modal-generico.component';
import { BotaoComponent } from '../../shared/botao/botao.component';
import { PaginacaoComponent } from '../../shared/paginacao/paginacao.component';
import { PesquisaComponent } from '../../shared/pesquisa/pesquisa.component';

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

  colunas = [
    { campo: 'id', titulo: 'ID' },
    { campo: 'nome', titulo: 'Nome' },
    { campo: 'quantidade', titulo: 'Quantidade' },
  ];

  dados: CategoriaEquipamento[] = [];
  categoriaSelecionada?: CategoriaEquipamento;

  paginaAtual: number = 1;
  itensPorPagina: number = 5;
  mostrarInativas: boolean = false;
  termoPesquisa: string = '';

  ngOnInit(): void {
    this.carregarDados();
  }

  private carregarDados(): void {
    this.dados = this.categoriaService.listarTodos();
  }

  selecionarPagina(pagina: number): void {
    this.paginaAtual = pagina;
  }

  get dadosPaginados(): CategoriaEquipamento[] {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    return this.categoriasFiltradas.slice(inicio, fim);
  }

  get categoriasFiltradas(): CategoriaEquipamento[] {
    let filtradas = this.dados.filter(c =>
      c.nome.toLowerCase().includes(this.termoPesquisa.toLowerCase())
    );

    if (this.mostrarInativas) {
      filtradas = filtradas.filter(c => c.estadoAtual === 'ATIVA');
    }

    return filtradas;
  }

  pesquisar(termo: string): void {
    this.termoPesquisa = termo;
    this.paginaAtual = 1;
  }

  toggleInativas(): void {
    this.mostrarInativas = !this.mostrarInativas;
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
          { label: 'Nome', campo: 'nome', tipo: 'text', obrigatorio: true },
          { label: 'Quantidade', campo: 'quantidade', tipo: 'number', obrigatorio: true }
        ],
        formData: {
          nome: '',
          quantidade: 0
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const nova: CategoriaEquipamento = {
          ...result,
          estadoAtual: 'ATIVA'
        };
        this.categoriaService.inserir(nova);
        this.carregarDados();
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
          { label: 'Quantidade', campo: 'quantidade', tipo: 'number' }
        ],
        formData: { ...this.categoriaSelecionada }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.categoriaSelecionada) {
        const atualizada: CategoriaEquipamento = {
          ...this.categoriaSelecionada,
          ...result,
          estadoAtual: 'ATIVA'
        };
        this.categoriaService.atualizar(atualizada);
        this.carregarDados();
        this.categoriaSelecionada = undefined;
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
        this.categoriaService.remover(categoria.id!);
        this.carregarDados();
        this.categoriaSelecionada = undefined;
      }
    });
  }
}
