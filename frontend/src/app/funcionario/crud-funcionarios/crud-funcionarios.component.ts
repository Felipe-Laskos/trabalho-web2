import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Funcionario } from '../../core/models/funcionario.model';
import { FuncionarioService } from '../../core/services/funcionario.service';
import { AuthService } from '../../core/services/auth.service';
import { BotaoComponent } from '../../shared/botao/botao.component';
import { PaginacaoComponent } from '../../shared/paginacao/paginacao.component';
import { PesquisaComponent } from '../../shared/pesquisa/pesquisa.component';
import { TabelaComponent } from '../../shared/tabela/tabela.component';
import { ModalGenericoComponent } from '../../shared/modal-generico/modal-generico.component';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';
import { NotificationService } from '../../core/services/notification.service';

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
export class CrudFuncionariosComponent implements OnInit {

  private funcionarioService = inject(FuncionarioService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private notificationService = inject(NotificationService);

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
  funcionariosFiltrados: Funcionario[] = [];

  paginaAtual: number = 0;
  itensPorPagina: number = 10;
  termoPesquisa: string = '';
  totalPaginas: number = 0;
  totalElements: number = 0;
  mostrarInativos: boolean = false;
  inserindo: boolean = false;

  ngOnInit(): void {
    this.carregarDados();
  }

  private carregarDados(): void {
    const requisicao =
      this.mostrarInativos
        ? this.funcionarioService.listarInativos(
            this.paginaAtual,
            this.itensPorPagina
          )
        : this.funcionarioService.listarAtivos(
            this.paginaAtual,
            this.itensPorPagina
          );

    requisicao.subscribe({
      next: (response) => {
        this.dados = response.content;
        this.totalPaginas = response.totalPages;
        this.totalElements = response.totalElements;
        this.paginaAtual = response.number;
        this.atualizarFiltro()
      }
    });
  }

  private atualizarFiltro(): void {
    const termo = (this.termoPesquisa ?? '').toLowerCase().trim();

    if (!this.dados) {
      this.funcionariosFiltrados = [];
      return;
    }

    if (termo === '') {
      this.funcionariosFiltrados = [...this.dados];
      return;
    }

    this.funcionariosFiltrados = this.dados.filter(f =>
      (f.nome ?? '').toLowerCase().includes(termo) ||
      (f.email ?? '').toLowerCase().includes(termo) ||
      (f.cargo ?? '').toLowerCase().includes(termo) ||
      f.id?.toString().includes(termo)
    );
  }

  selecionarPagina(pagina: number): void {
    this.paginaAtual = pagina;
    this.funcionarioSelecionado = undefined;
    this.carregarDados();
  }

  pesquisar(termo: string): void {
    this.termoPesquisa = termo;
    this.atualizarFiltro();
  }

  toggleInativos(): void {
    this.mostrarInativos = !this.mostrarInativos;
    this.paginaAtual = 0;
    this.funcionarioSelecionado = undefined;
    this.carregarDados();
  }

  selecionarLinha(item: any): void {
    this.funcionarioSelecionado = item;
  }

  adicionar(): void {
    if (this.inserindo) return;

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
        if (result.senha.length < 4) {
          this.notificationService.exibirAviso('A senha deve conter no mínimo 4 caracteres. Realize nova tentativa.');
          return;
        }

        if (result.dataNascimento) {
          const dataNascimento = new Date(result.dataNascimento);
          const hoje = new Date();
          const idade = hoje.getFullYear() - dataNascimento.getFullYear();
          if (idade < 18) {
            this.notificationService.exibirAviso('O funcionário deve ser maior de idade. Realize nova tentativa.');
            return;
          }
        }
        
        const novo: Funcionario = {
          ...result,
          ativo: true
        };

        this.inserindo = true;
        this.funcionarioService.inserir(novo).subscribe({
          next: () => {
            this.carregarDados();
          },
          error: () => {
            this.inserindo = false;
          },
          complete: () => {
            this.inserindo = false;
          }
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
        if (result.dataNascimento) {
          const dataNascimento = new Date(result.dataNascimento);
          const hoje = new Date();
          const idade = hoje.getFullYear() - dataNascimento.getFullYear();
          if (idade < 18) {
            this.notificationService.exibirAviso('O funcionário deve ser maior de idade. Realize nova tentativa.');
            return;
          }
        }

        const atualizado: Funcionario = {
          ...this.funcionarioSelecionado,
          ...result,
          ativo: true
        };
        this.funcionarioService.atualizar(atualizado).subscribe(() => {
          this.carregarDados();
          this.funcionarioSelecionado = undefined;
        });
      }
    });
  }

  excluir(): void {
    if (!this.funcionarioSelecionado) return;

    const funcionario = this.funcionarioSelecionado;

    const emailLogado = this.authService.getEmail();
    if (funcionario.email === emailLogado) {
      this.notificationService.exibirAviso('Você não pode remover a si mesmo!');
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
        this.funcionarioService.remover(funcionario.id).subscribe(() => {
          this.notificationService.exibirSucesso('Funcionário desativado com sucesso!');
          this.carregarDados();
          this.funcionarioSelecionado = undefined;
        });
      }
    });
  }

  reativar(): void {
    if(!this.funcionarioSelecionado) return;

    this.funcionarioService.reativar(this.funcionarioSelecionado.id!)
      .subscribe(()=>{
        this.notificationService
          .exibirSucesso(
            'Funcionário reativado.'
          );
        this.carregarDados();

        this.funcionarioSelecionado =
          undefined;
      });
  }
}
