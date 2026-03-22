import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-visualizar-solicitacoes',
  standalone: true,
imports: [CommonModule, FormsModule],
  templateUrl: './visualizar-solicitacoes.component.html',
  styleUrl: './visualizar-solicitacoes.component.css'
})
export class VisualizarSolicitacoesComponent {

solicitacoes = [
  {
    descricaoEquipamento: 'Notebook Dell Inspiron',
    dataHoraCriacao: new Date(), 
    estadoAtual: 'APROVADA',
    valorOrcado: 350,
    funcionarioResponsavel: { id: 1 }
  },
  {
    descricaoEquipamento: 'Impressora HP',
    dataHoraCriacao: new Date('2026-03-20T10:30:00'), 
    estadoAtual: 'ABERTA',
    valorOrcado: null,
    funcionarioResponsavel: { id: 2 }
  },
  {
    descricaoEquipamento: 'Monitor LG 24"',
    dataHoraCriacao: new Date('2026-03-18T14:00:00'), 
    estadoAtual: 'REJEITADA',
    valorOrcado: null,
    funcionarioResponsavel: { id: 2 }
  },
  {
    descricaoEquipamento: 'Teclado Mecânico',
    dataHoraCriacao: new Date(), 
    estadoAtual: 'ORÇADA',
    valorOrcado: 120,
    funcionarioResponsavel: { id: 1 }
  },
  {
    descricaoEquipamento: 'Mouse Logitech',
    dataHoraCriacao: new Date('2026-03-21T09:15:00'), 
    estadoAtual: 'FINALIZADA',
    valorOrcado: 80,
    funcionarioResponsavel: { id: 3 }
  },
  {
    descricaoEquipamento: 'Servidor Dell',
    dataHoraCriacao: new Date('2026-03-10T16:45:00'), 
    estadoAtual: 'PAGA',
    valorOrcado: 5000,
    funcionarioResponsavel: { id: 1 }
  }
];
  solicitacoesFiltradas = [...this.solicitacoes];

  visualizar(s: any) {
    //quando as telas estiverem prontas direcionar para elas
  }

  filtro: 'HOJE' | 'PERIODO' | 'TODAS' = 'TODAS';

dataInicio?: string;
dataFim?: string;

aplicarFiltros() {
  let lista = [...this.solicitacoes];

  const hoje = new Date();

  if (this.filtro === 'HOJE') {
    lista = lista.filter(s => {
      const data = new Date(s.dataHoraCriacao);
      return data.toDateString() === hoje.toDateString();
    });
  }

if (this.filtro === 'PERIODO' && this.dataInicio && this.dataFim) {
  const inicio = new Date(this.dataInicio);

  const fim = new Date(this.dataFim);
  fim.setHours(23, 59, 59, 999); 
  
  lista = lista.filter(s => {
    const data = new Date(s.dataHoraCriacao);
    return data >= inicio && data <= fim;
  });
}

  this.solicitacoesFiltradas = lista;
}
}