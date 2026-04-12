import { HistoricoSolicitacao } from '../../models/historico.model';

export abstract class IHistoricoService {
  abstract listarTodos(): HistoricoSolicitacao[];
  abstract listarPorSolicitacao(solicitacaoId: number): HistoricoSolicitacao[];
  abstract inserir(historico: HistoricoSolicitacao): void;
}