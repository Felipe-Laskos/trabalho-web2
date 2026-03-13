import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Solicitacao } from '../../models/solicitacao.model';
import { SolicitacaoENUM } from '../../models/solicitacaoENUM.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-funcionario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-funcionario.component.html',
  styleUrl: './home-funcionario.component.css'
})
export class HomeFuncionarioComponent {
solicitacoes: Solicitacao[] = [
  {
    dataHoraCriacao: '2026-03-03T10:30:00',
    descricaoEquipamento: 'Notebook Dell',
    descricaoDefeito: 'Não está carregando',
    estadoAtual: SolicitacaoENUM.ABERTA,
    cliente: { nome: 'Daniela' } as any
  },
  {
    dataHoraCriacao: '2026-02-06T11:10:00',
    descricaoEquipamento: 'Impressora HP',
    descricaoDefeito: 'Travando papel constantemente e imprimindo com cores erradas',
    estadoAtual: SolicitacaoENUM.ABERTA,
    cliente: { nome: 'Laura' } as any
  },
  {
    dataHoraCriacao: '2026-03-01T12:00:00',
    descricaoEquipamento: 'Computador',
    descricaoDefeito: 'Muito lento',
    estadoAtual: SolicitacaoENUM.ABERTA,
    cliente: { nome: 'Jess' } as any
  },
  {
    dataHoraCriacao: '2026-03-06T13:20:00',
    descricaoEquipamento: '1234567890123456789012345678901234567890',
    descricaoDefeito: 'Tela danificada',
    estadoAtual: SolicitacaoENUM.FINALIZADA,
    cliente: { nome: 'Nathalia' } as any
  },
  {
    dataHoraCriacao: '2026-03-06T13:20:00',
    descricaoEquipamento: '1234567890123456789012345678901234567890',
    descricaoDefeito: 'Tela trincada',
    estadoAtual: SolicitacaoENUM.ABERTA,
    cliente: { nome: 'Felipe' } as any
  }
];

get solicitacoesAbertas() {
  return this.solicitacoes.filter(
    s => s.estadoAtual === SolicitacaoENUM.ABERTA
  );
}

constructor(private router: Router) {}

efetuarOrcamento(id?: number) {
  this.router.navigate(['/funcionario/orcamento', id]);
}


}


