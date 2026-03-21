import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
//import { HeaderComponent } from '../../shared/header/header.component';
import { mockSolicitacao } from '../..//mocks/solicitacao.mock';
import { Solicitacao } from '../../models/solicitacao.model';
import { Funcionario } from '../../models/funcionario.model';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-mostrar-orcamento',
  standalone: true,
  imports: [CommonModule],
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
}


