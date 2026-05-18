import { Observable } from 'rxjs/internal/Observable';
import { HistoricoSolicitacao } from '../models/historico.model';
import { Page } from '../dto/response/page.dto';

export interface IHistoricoService {
  listarTodos(): Observable<HistoricoSolicitacao[]>;
  listarPorSolicitacao(solicitacaoId: number, page: number, size: number): Observable<Page<HistoricoSolicitacao>>;
}
