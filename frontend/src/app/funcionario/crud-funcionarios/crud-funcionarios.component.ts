import { Component } from '@angular/core';
import { Funcionario } from '../../models/funcionario.model';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { BotaoComponent } from '../../shared/botao/botao.component';
import { PaginacaoComponent } from '../../shared/paginacao/paginacao.component';
import { PesquisaComponent } from '../../shared/pesquisa/pesquisa.component';
import { TabelaComponent } from '../../shared/tabela/tabela.component'; 
import { ModalGenericoComponent } from '../../shared/modal-generico/modal-generico.component';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';

@Component({
  selector: 'app-crud-funcionarios',
  standalone: true,
  imports: [
    CommonModule,
    TabelaComponent,
    MatDialogModule,
    BotaoComponent,
    PaginacaoComponent,
    PesquisaComponent,
    TruncatePipe,
  ],
  templateUrl: './crud-funcionarios.component.html',
  styleUrl: './crud-funcionarios.component.css'
})
export class CrudFuncionariosComponent {
  colunas = [
    { campo: 'id', titulo: 'ID' },
    { campo: 'nome', titulo: 'Nome', truncar: 20, tipo: 'nome' as const},
    { campo: 'cpf', titulo: 'CPF', tipo: 'cpf' as const },
    { campo: 'email', titulo: 'Email', truncar: 20},
    { campo: 'dataNascimento', titulo: 'Data de Nascimento'},
    { campo: 'cargo', titulo: 'Cargo', truncar: 20, tipo: 'nome' as const },
  ];

  dados = [
    { id: 1, nome: 'Maria Silva Pereira', cpf: '123.456.789-00', email: 'maria@empresa.com', dataNascimento: '1998-11-12', cargo: 'Técnico de Suporte', ativo: true},
    { id: 2, nome: 'Mário da Rocha Bastos', cpf: '987.654.321-00', email: 'mario@empresa.com', dataNascimento: '1980-05-20', cargo: 'Analista de Sistemas', ativo: true},
    { id: 3, nome: 'João Carlos Oliveira', cpf: '456.789.123-00', email: 'joao@empresa.com', dataNascimento: '1990-03-15', cargo: 'Atendente', ativo: true},
    { id: 4, nome: 'Ana Paula Souza', cpf: '321.654.987-00', email: 'ana@empresa.com', dataNascimento: '1985-07-22', cargo: 'Técnico de Suporte', ativo: false}
  ];

  funcionarioSelecionado?: Funcionario;

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
      let filtradas = this.dados.filter(f =>
        f.nome.toLowerCase().includes(this.termoPesquisa.toLowerCase()) ||
        f.cargo.toLowerCase().includes(this.termoPesquisa.toLowerCase()) ||
        f.email.toLowerCase().includes(this.termoPesquisa.toLowerCase()) ||
        f.dataNascimento.toLowerCase().includes(this.termoPesquisa.toLowerCase())
      );

      if (this.mostrarInativas) {
      filtradas = filtradas.filter(f => f.ativo === true);
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
      this.funcionarioSelecionado = item;
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
          titulo: 'Adicionar Funcionário',
          campos: [
            { label: 'Nome', campo: 'nome', tipo: 'text', obrigatorio: true },
            { label: 'CPF', campo: 'cpf', tipo: 'text', obrigatorio: true },
            { label: 'Email', campo: 'email', tipo: 'text', obrigatorio: true },
            { label: 'Data de Nascimento', campo: 'dataNascimento', tipo: 'date', obrigatorio: true },
            { label: 'Cargo', campo: 'cargo', tipo: 'text', obrigatorio: true }
          ],
          formData: {
            nome: '',
            cpf: '',
            email: '',
            dataNascimento: '',
            cargo: ''
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
      if (!this.funcionarioSelecionado) return;
  
      const dialogRef = this.dialog.open(ModalGenericoComponent, {
        data: {
          tipo: 'formulario',
          titulo: 'Editar Funcionário',
          campos: [
            { label: 'Nome', campo: 'nome', tipo: 'text' },
            { label: 'Email', campo: 'email', tipo: 'text' },
            { label: 'CPF', campo: 'cpf', tipo: 'text' },
            { label: 'Data de Nascimento', campo: 'dataNascimento', tipo: 'date' },
            { label: 'Cargo', campo: 'cargo', tipo: 'text' }
          ],
          formData: { ...this.funcionarioSelecionado }
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result && this.funcionarioSelecionado) {
          Object.assign(this.funcionarioSelecionado, result),
          this.funcionarioSelecionado.ativo = true;
        };
      });
    }
  
    excluir() {
      if (!this.funcionarioSelecionado) return;
  
      const funcionario = this.funcionarioSelecionado; 
  
      const dialogRef = this.dialog.open(ModalGenericoComponent, {
        data: {
          tipo: 'confirmacao',
          titulo: 'Confirmar Exclusão',
          mensagem: 'Tem certeza que deseja desativar este funcionário?',
          textoConfirmar: 'Sim',
          textoCancelar: 'Não'
        }
      });
  
      dialogRef.afterClosed().subscribe(confirmado => {
        if (confirmado) {
          funcionario.ativo = false;
  
          console.log('Funcionário desativado:', funcionario);
  
          this.funcionarioSelecionado = undefined;
        }
      });
    }
}
