import { HistoricoSolicitacao } from '../models/historico.model';

export interface IHistoricoService {
  listarTodos(): HistoricoSolicitacao[];
  listarPorSolicitacao(solicitacaoId: number): HistoricoSolicitacao[];
  inserir(historico: HistoricoSolicitacao): void;
}