import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { mockSolicitacao } from '../..//mocks/solicitacao.mock';
import { mockCliente } from '../..//mocks/clientes.mock';
import { mockFuncionario } from '../../mocks/funcionario.mock'

@Component({
  selector: 'app-mostrar-orcamento',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './mostrar-orcamento.component.html',
  styleUrl: './mostrar-orcamento.component.css',
})

export class MostrarOrcamentoComponent implements OnInit {
      solicitacao: any;
      cliente: any;
      funcionario: any;

      ngOnInit(): void {
        this.solicitacao = mockSolicitacao[1];
        this.cliente = mockCliente.find((c: any) => c.id === this.solicitacao.cliente_id);
        this.cliente = mockCliente[1];
        this.funcionario = mockFuncionario[1];
 }

 exibirModal: boolean = false;
 estadoModal: 'confirmacao' | 'sucesso' = 'confirmacao';

 aprovarServico(): void {
  this.estadoModal = 'confirmacao';
  this.exibirModal = true;
 } 

  confirmarAprovacao(): void {
  if (this.solicitacao) {
    this.solicitacao.status = 'APROVADA';
}
  this.estadoModal = 'sucesso';
  }
// Função para fechar a mensagem
fecharModal(): void {
  this.exibirModal = false;
  }
}


