import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Funcionario } from '../../models/funcionario.model';
import { FuncionarioService } from '../../services/funcionario.service';
import { AuthService } from '../../services/auth.service';
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
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private aviso = inject(MatSnackBar);

  colunas = [
    { campo: 'id', titulo: 'ID' },
    { campo: 'nome', titulo: 'Nome', truncar: 20, tipo: 'nome' as const },
    { campo: 'cpf', titulo: 'CPF', tipo: 'cpf' as const },
    { campo: 'email', titulo: 'Email', truncar: 20 },
    { campo: 'dataNascimento', titulo: 'Data de Nascimento' },
    { campo: 'cargo', titulo: 'Cargo', truncar: 20, tipo: 'nome' as const },
  ];

  dados: Funcionario[] = [];
  funcionarioSelecionado?: Funcionario;

  paginaAtual: number = 1;
  itensPorPagina: number = 5;
  mostrarInativas: boolean = false;
  termoPesquisa: string = '';

  ngOnInit(): void {
    this.carregarDados();
  }

  private carregarDados(): void {
    this.dados = this.funcionarioService.listarTodos();
  }

  selecionarPagina(pagina: number): void {
    this.paginaAtual = pagina;
  }

  get dadosPaginados(): Funcionario[] {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    return this.funcionariosFiltrados.slice(inicio, fim);
  }

  get funcionariosFiltrados(): Funcionario[] {
    let filtrados = this.dados.filter(f =>
      f.nome.toLowerCase().includes(this.termoPesquisa.toLowerCase()) ||
      f.cargo.toLowerCase().includes(this.termoPesquisa.toLowerCase()) ||
      f.email.toLowerCase().includes(this.termoPesquisa.toLowerCase())
    );

    if (this.mostrarInativas) {
      filtrados = filtrados.filter(f => f.ativo === true);
    }

    return filtrados;
  }

  pesquisar(termo: string): void {
    this.termoPesquisa = termo;
    this.paginaAtual = 1;
  }

  toggleInativas(): void {
    this.mostrarInativas = !this.mostrarInativas;
  }

  selecionarLinha(item: any): void {
    this.funcionarioSelecionado = item;
  }

  adicionar(): void {
    const dialogRef = this.dialog.open(ModalGenericoComponent, {
      data: {
        tipo: 'formulario',
        titulo: 'Adicionar Funcionário',
        campos: [
          { label: 'Nome', campo: 'nome', tipo: 'text', obrigatorio: true },
          { label: 'CPF', campo: 'cpf', tipo: 'text', obrigatorio: true },
          { label: 'Email', campo: 'email', tipo: 'text', obrigatorio: true },
          { label: 'Data de Nascimento', campo: 'dataNascimento', tipo: 'date', obrigatorio: true },
          { label: 'Cargo', campo: 'cargo', tipo: 'text', obrigatorio: true },
          { label: 'Senha', campo: 'senha', tipo: 'text', obrigatorio: true }
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
        const emailExiste = this.funcionarioService.buscarPorEmail(result.email);
        if (emailExiste) {
          this.aviso.open('E-mail já cadastrado!', 'OK', { duration: 3000, verticalPosition: 'top' });
          return;
        }

        const novo: Funcionario = {
          ...result,
          ativo: true
        };
        this.funcionarioService.inserir(novo);
        this.carregarDados();
      }
    });
  }

  atualizar(): void {
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
        const atualizado: Funcionario = {
          ...this.funcionarioSelecionado,
          ...result,
          ativo: true
        };
        this.funcionarioService.atualizar(atualizado);
        this.carregarDados();
        this.funcionarioSelecionado = undefined;
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

    const ativos = this.dados.filter(f => f.ativo !== false);
    if (ativos.length <= 1) {
      this.aviso.open('Não é possível remover o último funcionário!', 'OK', { duration: 3000, verticalPosition: 'top' });
      return;
    }

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
        this.funcionarioService.atualizar(funcionario);
        this.carregarDados();
        this.funcionarioSelecionado = undefined;
      }
    });
  }
}
