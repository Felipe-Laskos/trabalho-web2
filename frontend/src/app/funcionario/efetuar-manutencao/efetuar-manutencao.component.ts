import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgClass, CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CardVisualizacaoComponent } from '../../shared/card-visualizacao/card-visualizacao.component';
import { BotaoComponent } from '../../shared/botao/botao.component';
import { TextAreaComponent } from "../../shared/text-area/text-area.component";
import { mockSolicitacao } from '../../mocks/solicitacao.mock';
import { Solicitacao } from '../../models/solicitacao.model';
import { Cliente } from '../../models/cliente.model';
import { mockFuncionario } from '../../mocks/funcionario.mock';
import { BotaoAprovarComponent } from '../../shared/botao-aprovar/botao-aprovar.component';
import { BotaoCancelarComponent } from "../../shared/botao-cancelar/botao-cancelar.component"; 


@Component({
  selector: 'app-efetuar-manutencao',
  standalone: true,
  imports: [ReactiveFormsModule, CardVisualizacaoComponent, BotaoComponent, TextAreaComponent, NgClass, CommonModule, BotaoAprovarComponent, BotaoCancelarComponent],
  templateUrl: './efetuar-manutencao.component.html',
  styleUrls: ['./efetuar-manutencao.component.css']
})
export class EfetuarManutencaoComponent implements OnInit {
   constructor(private router: Router, private route: ActivatedRoute) {}

  solicitacao: Solicitacao | undefined;
  cliente: Cliente | undefined;
  mostrarFormulario = false;
  funcionarioLogado = mockFuncionario[1];
  dataHoraAcesso: Date = new Date();
  exibirModal: boolean = false;

  estadoModal:
    | 'confirmacao'
    | 'sucesso'
    | 'confirmarRejeicao'
    | 'motivoRejeicao'
    | 'sucessoRejeicao' = 'confirmacao';

  form = new FormGroup({
    descricao: new FormControl(''),
    orientacoes: new FormControl('')
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idUrl = params.get('id'); 

      if (idUrl) {
        const idSolicitacao = Number(idUrl); 
        const solicitacaoEncontrada = mockSolicitacao.find(
          (s) => s.id === idSolicitacao && (s.estadoAtual === 'APROVADA' || s.estadoAtual === 'REDIRECIONADA')
        );

        if (solicitacaoEncontrada) {
          this.solicitacao = solicitacaoEncontrada;
          
          this.form.reset(); 
          this.mostrarFormulario = false;
        } else {
          this.solicitacao = undefined;
           this.router.navigate(['/funcionario/visualizar-solicitacoes']);
        }
      
        this.dataHoraAcesso = new Date();

      }
    });
  }

  abrirFormulario() {
    this.mostrarFormulario = true;
  }

  redirecionar() {
    if (this.solicitacao) {
       this.router.navigate(['/funcionario/redirecionar-manutencao', this.solicitacao.id]);
    } else {
      alert('Nenhuma solicitação encontrada para redirecionar!');
    }
  }

  confirmarManutencao() {  //AJUSTAR PARA QUE ALTERE NA TABELA DA DANI
    const dados = this.form.value; // FALTA ADICIONAR O FUNCIONÁRIO LOGADO E A DATA DE REALIZAÇÃO DA MANUTENÇÃO 

    if (!dados.descricao || !dados.orientacoes) {
      alert('Preencha todos os campos!');
      return;
    }

    if (!this.solicitacao) {
      alert('Nenhuma solicitação encontrada!');
      return;
    }

    this.solicitacao.estadoAtual = 'ARRUMADA';

    this.solicitacao.descricaoManutencao = dados.descricao;
    this.solicitacao.orientacoesCliente = dados.orientacoes;
    this.solicitacao.dataHoraCriacao = new Date().toLocaleString('pt-BR'); 
    this.solicitacao.funcionarioResponsavel = this.funcionarioLogado;

    this.form.reset();
    this.mostrarFormulario = false;
  }

  
    aprovarServico(): void {
    this.estadoModal = 'confirmacao';
    this.exibirModal = true;
  }

   fecharModal() {
    this.exibirModal = false;
    this.estadoModal = 'confirmacao';
  }

  obterCorDoBadge(estado: string | undefined): string {
    if (!estado) return 'badge-cinza'; 
    switch (estado.toUpperCase()) {
      case 'APROVADA':
        return 'badge-amarelo';
      case 'REDIRECIONADA':
        return 'badge-roxo';
      case 'ARRUMADA':
        return 'badge-azul';
      default:
        return 'badge-cinza';
    }
  }
}