import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { mockSolicitacao } from '../..//mocks/solicitacao.mock';
import { Solicitacao } from '../../models/solicitacao.model';
import { Funcionario } from '../../models/funcionario.model';
import { Cliente } from '../../models/cliente.model';
import { CardVisualizacaoComponent } from '../../shared/card-visualizacao/card-visualizacao.component';
import { BotaoCancelarComponent } from '../../shared/botao-cancelar/botao-cancelar.component';
import { BotaoAprovarComponent } from '../../shared/botao-aprovar/botao-aprovar.component';


@Component({
  selector: 'app-mostrar-orcamento',
  standalone: true,
  imports: [CommonModule,CardVisualizacaoComponent,BotaoCancelarComponent,BotaoAprovarComponent],
  templateUrl: './mostrar-orcamento.component.html',
  styleUrl: './mostrar-orcamento.component.css',
})

export class MostrarOrcamentoComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

      solicitacao: Solicitacao | undefined;
      cliente: Cliente | undefined;
      funcionario: Funcionario | undefined;

      ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');
        if (!idParam) return;

        const id = Number(idParam);
        this.solicitacao = mockSolicitacao.find(s => s.id === id);
        
        if (this.solicitacao) {
          this.cliente = this.solicitacao.cliente;
          this.funcionario = this.solicitacao.funcionarioResponsavel;
        }
      }

 exibirModal: boolean = false;
 estadoModal: 'confirmacao' | 'sucesso' = 'confirmacao';

 aprovarServico(): void {
  this.estadoModal = 'confirmacao';
  this.exibirModal = true;
 } 
  confirmarAprovacao(): void {
  if (this.solicitacao) {
    this.solicitacao.estadoAtual = 'APROVADA';
  }
  this.estadoModal = 'sucesso';
}
fecharModal(): void {
  this.exibirModal = false;
  }

clickCancelar() {
  if(this.solicitacao) {
     this.solicitacao.estadoAtual = 'REJEITADA'; //AJUSTAR PARA SER UM MODAl
         console.log("Estado atualizado!");
         alert('O orçamento foi cancelado com sucesso');
   }
 } 
}


