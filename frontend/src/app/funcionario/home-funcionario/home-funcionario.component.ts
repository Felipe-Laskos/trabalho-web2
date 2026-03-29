import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Solicitacao } from '../../models/solicitacao.model';
import { SolicitacaoENUM } from '../../models/solicitacaoENUM.model';
import { Router } from '@angular/router';
import { CardVisualizacaoComponent } from '../../shared/card-visualizacao/card-visualizacao.component';
import { BotaoComponent } from '../../shared/botao/botao.component';

@Component({
  selector: 'app-home-funcionario',
  standalone: true,
  imports: [CommonModule, CardVisualizacaoComponent, BotaoComponent],
  templateUrl: './home-funcionario.component.html',
  styleUrl: './home-funcionario.component.css'
})
export class HomeFuncionarioComponent {
solicitacoes: Solicitacao[] = [
  {
    id: 1,
    dataHoraCriacao: '2026-03-03T10:30:00',
    descricaoEquipamento: 'Notebook Dell',
    descricaoDefeito: 'Não está carregando',
    estadoAtual: SolicitacaoENUM.ABERTA,
    cliente: {
      cpf: '11111111111',
      nome: 'Daniela',
      email: 'daniela@email.com',
      telefone: '41999999999'
    }
  },
  {
    id: 2,
    dataHoraCriacao: '2026-02-06T11:10:00',
    descricaoEquipamento: 'Impressora HP',
    descricaoDefeito: 'Travando papel constantemente e imprimindo com cores erradas',
    estadoAtual: SolicitacaoENUM.ABERTA,
    cliente: {
      cpf: '22222222222',
      nome: 'Laura',
      email: 'laura@email.com',
      telefone: '41988888888'
    }
  },
  {
    id: 3,
    dataHoraCriacao: '2026-03-01T12:00:00',
    descricaoEquipamento: 'Computador',
    descricaoDefeito: 'Muito lento',
    estadoAtual: SolicitacaoENUM.ABERTA,
    cliente: {
      cpf: '33333333333',
      nome: 'Jess',
      email: 'jess@email.com',
      telefone: '41977777777'
    }
  },
  {
    id: 4,
    dataHoraCriacao: '2026-03-06T13:20:00',
    descricaoEquipamento: '1234567890123456789012345678901234567890',
    descricaoDefeito: 'Tela danificada',
    estadoAtual: SolicitacaoENUM.FINALIZADA,
    cliente: {
      cpf: '44444444444',
      nome: 'Nathalia',
      email: 'nath@email.com',
      telefone: '41966666666'
    }
  },
  {
    id: 5,
    dataHoraCriacao: '2026-03-06T13:20:00',
    descricaoEquipamento: '1234567890123456789012345678901234567890',
    descricaoDefeito: 'Tela trincada',
    estadoAtual: SolicitacaoENUM.ABERTA,
    cliente: {
      cpf: '55555555555',
      nome: 'Felipe',
      email: 'felipe@email.com',
      telefone: '41955555555'
    }
  }
];

get solicitacoesAbertas() {
  return this.solicitacoes.filter(
    s => s.estadoAtual === SolicitacaoENUM.ABERTA
  );
}

constructor(private router: Router) {}

efetuarOrcamento(id?: number) {
  this.router.navigate(['/funcionario/efetuar-orcamento', id]);
}


}


