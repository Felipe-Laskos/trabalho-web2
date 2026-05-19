import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Funcionario } from '../../core/models/funcionario.model';
import { FuncionarioService } from '../../core/services/funcionario.service';
import { ClienteService } from '../../core/services/cliente.service';
import { AuthService } from '../../core/services/auth.service';
import { BotaoComponent } from '../../shared/botao/botao.component';
import { PaginacaoComponent } from '../../shared/paginacao/paginacao.component';
import { PesquisaComponent } from '../../shared/pesquisa/pesquisa.component';
import { ColunaTabela, TabelaComponent } from '../../shared/tabela/tabela.component';
import { ModalGenericoComponent } from '../../shared/modal-generico/modal-generico.component';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';

@Component({
  selector: 'app-crud-funcionarios',
  standalone: true,
  imports: [
    CommonModule,
    TabelaComponent,
    MatDialogModule,
    MatSnackBarModule,
    BotaoComponent,
    PaginacaoComponent,
    PesquisaComponent,
    TruncatePipe,
  ],
  templateUrl: './crud-funcionarios.component.html',
  styleUrl: './crud-funcionarios.component.css'
})
export class CrudFuncionariosComponent implements OnInit {

  private funcionarioService = inject(FuncionarioService);
  private clienteService = inject(ClienteService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private aviso = inject(MatSnackBar);

 colunas: ColunaTabela[] = [
    { campo: 'id', titulo: 'ID', tipo: 'texto' },
    { campo: 'nome', titulo: 'Nome', truncar: 20, tipo: 'nome' },
    { campo: 'cpf', titulo: 'CPF', tipo: 'cpf' },
    { campo: 'email', titulo: 'Email', truncar: 20, tipo: 'texto' },
    { campo: 'dataNascimento', titulo: 'Data de Nascimento', tipo: 'data' },
    { campo: 'cargo', titulo: 'Cargo', truncar: 20, tipo: 'nome' },
  ];

  dados: Funcionario[] = [];
  funcionarioSelecionado?: Funcionario;
  paginaAtual: number = 0;
  itensPorPagina: number = 5;
  totalElements: number = 0;
  mostrarInativas: boolean = false;
  termoPesquisa: string = '';

  ngOnInit(): void {
    this.carregarDados();
  }

  private carregarDados(): void {
    this.funcionarioService.listarComFiltros(
        this.termoPesquisa, 
        this.mostrarInativas, 
        this.paginaAtual, 
        this.itensPorPagina
    ).subscribe({
      next: pagina => {
        this.dados = pagina.content;
        this.totalElements = pagina.totalElements;
        this.funcionarioSelecionado = undefined;
      },
      error: () => {
        this.aviso.open('Erro ao carregar os dados.', 'OK', { duration: 3000 });
      }
    });
  }

  selecionarPagina(pagina: number): void {
    this.paginaAtual = pagina - 1;
    this.carregarDados();
  }

  pesquisar(termo: string): void {
    this.termoPesquisa = termo;
    this.paginaAtual = 0;
    this.carregarDados();
  }

  toggleInativas(): void {
    this.mostrarInativas = !this.mostrarInativas;
    this.paginaAtual = 0;
    this.carregarDados();
  }

  selecionarLinha(item: any): void {
    this.funcionarioSelecionado = item;
  }

  adicionar(): void {
    const dialogRef = this.dialog.open(ModalGenericoComponent, {
      width: '700px',
      maxWidth: '95vw',
      data: {
        tipo: 'formulario',
        titulo: 'Adicionar Funcionário',
        campos: [
          { label: 'Nome', campo: 'nome', tipo: 'text', validacao: 'texto', obrigatorio: true  },
          { label: 'CPF', campo: 'cpf', tipo: 'text', validacao: 'inteiro', obrigatorio: true  },
          { label: 'Email', campo: 'email', tipo: 'text', validacao: 'email', obrigatorio: true  },
          { label: 'Data de Nascimento', campo: 'dataNascimento', tipo: 'date', obrigatorio: true  },
          { label: 'Cargo', campo: 'cargo', tipo: 'text', obrigatorio: true, validacao: 'textoNum' },
          { senha: true, label: 'Senha', campo: 'senha', tipo: 'password', obrigatorio: true }
        ],
        formData: {
          nome: '',
          cpf: '',
          email: '',
          dataNascimento: '',
          cargo: '',
          senha: ''
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const cpfLimpo = result.cpf.replace(/\D/g, '');

        const novo: Funcionario = {
          ...result,
          cpf: cpfLimpo,
          ativo: true
        };
        this.funcionarioService.inserir(novo).subscribe({
          next: () => this.carregarDados(),
          error: (err: any) => this.aviso.open(err?.error?.message || 'Erro ao adicionar funcionário', 'OK', { duration: 3000 })
        });
      }
    });
  }

  atualizar(): void {
    if (!this.funcionarioSelecionado) return;

    const dialogRef = this.dialog.open(ModalGenericoComponent, {
      width: '700px',
      maxWidth: '95vw',
      data: {
        tipo: 'formulario',
        titulo: 'Editar Funcionário',
        campos: [
          { label: 'Nome', campo: 'nome', tipo: 'text', validacao: 'texto', obrigatorio: true },
          { label: 'Email', campo: 'email', tipo: 'text', validacao: 'email', obrigatorio: true },
          { label: 'CPF', campo: 'cpf', tipo: 'text', readonly: true },
          { label: 'Data de Nascimento', campo: 'dataNascimento', tipo: 'date', obrigatorio: true },
          { label: 'Cargo', campo: 'cargo', tipo: 'text', validacao: 'texto', obrigatorio: true }
        ],
        formData: { ...this.funcionarioSelecionado }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.funcionarioSelecionado) {
        const atualizado: Funcionario = {
          ...this.funcionarioSelecionado,
          ...result,
        };
        this.funcionarioService.atualizar(atualizado).subscribe({
            next: () => this.carregarDados(),
            error: (err: any) => this.aviso.open(err?.error?.message || 'Erro ao atualizar funcionário', 'OK', { duration: 3000 })
        });
      }
    });
  }

  excluir(): void {
    if (!this.funcionarioSelecionado) return;

    const funcionario = this.funcionarioSelecionado;

    const emailLogado = this.authService.getEmail();
    if (funcionario.email === emailLogado) {
      this.aviso.open('Você não pode remover a si mesmo!', 'OK', { duration: 3000, verticalPosition: 'top' });
      return;
    }

    const dialogRef = this.dialog.open(ModalGenericoComponent, {
      data: {
        tipo: 'confirmacao',
        titulo: 'Confirmar Exclusão',
        mensagem: `Tem certeza que deseja desativar o funcionário ${funcionario.nome}?`,
        textoConfirmar: 'Sim',
        textoCancelar: 'Não'
      }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        funcionario.ativo = false;
        this.funcionarioService.atualizar(funcionario).subscribe({
          next: () => this.carregarDados(),
          error: (err: any) => this.aviso.open(err?.error?.message || 'Erro ao desativar funcionário', 'OK', { duration: 3000 })
        });
      }
    });
  }
}