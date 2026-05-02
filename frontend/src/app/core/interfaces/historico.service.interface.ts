import { Observable } from 'rxjs/internal/Observable';
import { HistoricoSolicitacao } from '../models/historico.model';

export interface IHistoricoService {
  listarTodos(): Observable<HistoricoSolicitacao[]>;
  listarPorSolicitacao(solicitacaoId: number): Observable<HistoricoSolicitacao[]>;
  inserir(historico: HistoricoSolicitacao): Observable<HistoricoSolicitacao>;
}