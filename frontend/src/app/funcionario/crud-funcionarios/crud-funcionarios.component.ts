import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Funcionario } from '../../models/funcionario.model';
import { FuncionarioService } from '../../services/funcionario.service';
import { ClienteService } from '../../services/cliente.service';
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
  private clienteService = inject(ClienteService);
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
  mostrarInativas: boolean = true;
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
    const termo = this.termoPesquisa.toLowerCase();
    let filtrados = this.dados.filter(f =>
      f.id?.toString().includes(termo) ||
      f.nome.toLowerCase().includes(termo) ||
      f.cargo.toLowerCase().includes(termo) ||
      f.email.toLowerCase().includes(termo)
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
        const emailEmFuncionario = this.funcionarioService.buscarPorEmail(result.email);
        const emailEmCliente = this.clienteService.buscarPorEmail(result.email);
        if (emailEmFuncionario || emailEmCliente) {
          this.aviso.open('E-mail já cadastrado no sistema. Realize nova tentativa.', 'OK', { duration: 3000, verticalPosition: 'top' });
          return;
        }

        const cpfEmFuncionario = this.funcionarioService.buscarPorCpf(result.cpf);
        const cpfEmCliente = this.clienteService.buscarPorCpf(result.cpf);

        if (cpfEmFuncionario || cpfEmCliente) {
          this.aviso.open('CPF já cadastrado no sistema. Realize nova tentativa.', 'OK', { duration: 3000, verticalPosition: 'top' });
          return;
        }

        if (result.senha.length < 4) {
          this.aviso.open('A senha deve conter no mínimo 4 caracteres. Realize nova tentativa.', 'OK', { duration: 3000, verticalPosition: 'top' });
          return;
        }

        if (result.dataNascimento) {
          const dataNascimento = new Date(result.dataNascimento);
          const hoje = new Date();
          const idade = hoje.getFullYear() - dataNascimento.getFullYear();
          if (idade < 18) {
            this.aviso.open('O funcionário deve ser maior de idade. Realize nova tentativa.', 'OK', { duration: 3000, verticalPosition: 'top' });
            return;
          }
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
        if (result.email !== this.funcionarioSelecionado.email) {
          const emailEmFuncionario = this.funcionarioService.buscarPorEmail(result.email);
          const emailEmCliente = this.clienteService.buscarPorEmail(result.email);
          if (emailEmFuncionario || emailEmCliente) {
            this.aviso.open('E-mail já cadastrado no sistema. Realize nova tentativa.', 'OK', { 
              duration: 3000, 
              verticalPosition: 'top' 
            });
            return;
          }
        }

        if (result.dataNascimento) {
          const dataNascimento = new Date(result.dataNascimento);
          const hoje = new Date();
          const idade = hoje.getFullYear() - dataNascimento.getFullYear();
          if (idade < 18) {
            this.aviso.open('O funcionário deve ser maior de idade. Realize nova tentativa.', 'OK', { duration: 3000, verticalPosition: 'top' });
            return;
          }
        }

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
