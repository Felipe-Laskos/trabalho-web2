import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriaEquipamento } from '../../models/categoria.model';
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
export class CrudCategoriaComponent {

  colunas = [
    { campo: 'id', titulo: 'ID' },
    { campo: 'nome', titulo: 'Nome'},
    { campo: 'quantidade', titulo: 'Quantidade'},
  ];

  dados = [
    { id: 1, nome: 'Laptop', quantidade: 10, estadoAtual: 'ATIVA' },
    { id: 2, nome: 'Ultrabook', quantidade: 5, estadoAtual: 'ATIVA' },
    { id: 3, nome: 'Desktop torre', quantidade: 12, estadoAtual: 'ATIVA' },
    { id: 4, nome: 'All-in-One', quantidade: 2, estadoAtual: 'ATIVA' },
    { id: 5, nome: 'Impressora jato de tinta', quantidade: 5, estadoAtual: 'ATIVA' },
    { id: 6, nome: 'Impressora laser', quantidade: 8, estadoAtual: 'ATIVA' },
    { id: 7, nome: 'Monitor LED', quantidade: 2, estadoAtual: 'ATIVA' },
    { id: 8, nome: 'Mouse sem fio', quantidade: 0, estadoAtual: 'INATIVA' },
    { id: 9, nome: 'Teclado mecânico', quantidade: 0, estadoAtual: 'INATIVA' },
  ];

  categoriaSelecionada?: CategoriaEquipamento;

  constructor(private dialog: MatDialog) {}

  // paginação
  paginaAtual: number = 1;
  itensPorPagina: number = 5;

  selecionarPagina(pagina: number) {
    this.paginaAtual = pagina;
  }

  get dadosPaginados() {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;

    return this.categoriasFiltradas.slice(inicio, fim);
  }

  // filtro inativas e pesquisa
  mostrarInativas: boolean = false;

  get categoriasFiltradas() {
    let filtradas = this.dados.filter(c =>
      c.nome.toLowerCase().includes(this.termoPesquisa.toLowerCase())
    );

    if (this.mostrarInativas) {
      filtradas = filtradas.filter(c => c.estadoAtual === 'ATIVA');
    }

    return filtradas;
  }

  // pesquisa
  termoPesquisa: string = '';

  pesquisar(termo: string) {
    this.termoPesquisa = termo;
    this.paginaAtual = 1;
  }

  // categoria desativadas
  toggleInativas() {
    this.mostrarInativas = !this.mostrarInativas;
  }

  // seleção de linha
  selecionarLinha(item: any) {
    this.categoriaSelecionada = item;
  }

  gerarNovoId(): number {
    if (this.dados.length === 0) return 1;

    const maiorId = Math.max(...this.dados.map(c => c.id));
    return maiorId + 1;
  }

  // funções CRUD
  adicionar() {
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
        this.dados.push({
          ...result,
          id: this.gerarNovoId(),
          estadoAtual: 'ATIVA'
        });
      }
    });
  }

  atualizar() {
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
        Object.assign(this.categoriaSelecionada, result),
        this.categoriaSelecionada.estadoAtual = 'ATIVA';
      }
    });
  }

  excluir() {
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
        categoria.estadoAtual = 'INATIVA';

        console.log('Categoria inativada:', categoria);

        this.categoriaSelecionada = undefined;
      }
    });
  }
}


