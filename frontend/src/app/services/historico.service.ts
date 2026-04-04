import { Injectable } from '@angular/core';
import { HistoricoSolicitacao } from '../models/historico.model';
import { mockHistoricoSolicitacao } from '../mocks/historico.mock';

const LS_CHAVE = "historicos";

@Injectable({
  providedIn: 'root'
})
export class HistoricoService {

  constructor() {
    if (!localStorage[LS_CHAVE]) {
      localStorage[LS_CHAVE] = JSON.stringify(mockHistoricoSolicitacao);
    }
  }

  listarTodos(): HistoricoSolicitacao[] {
    const historicos = localStorage[LS_CHAVE];
    return historicos ? JSON.parse(historicos) : [];
  }

  listarPorSolicitacao(solicitacaoId: number): HistoricoSolicitacao[] {
    return this.listarTodos()
      .filter(h => h.solicitacaoId === solicitacaoId)
      .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());
  }

  inserir(historico: HistoricoSolicitacao): void {
    const historicos = this.listarTodos();
    historico.id = new Date().getTime();
    historicos.push(historico);
    localStorage[LS_CHAVE] = JSON.stringify(historicos);
  }
}
