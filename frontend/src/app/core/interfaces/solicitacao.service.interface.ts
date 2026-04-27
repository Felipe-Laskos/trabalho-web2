import { Observable } from "rxjs";
import { Solicitacao } from "../models/solicitacao.model"; 

export interface ISolicitacaoService {
  listarTodos(): Observable<Solicitacao[]>;
  buscarPorId(id: number): Observable<Solicitacao>;
  inserir(solicitacao: Solicitacao): Observable<Solicitacao>;
  atualizar(solicitacao: Solicitacao): Observable<Solicitacao>;
  remover(id: number): Observable<void>;
  aprovar(id: number): Observable<Solicitacao>;
  rejeitar(id: number, motivo: string): Observable<Solicitacao>;
  resgatar(id: number): Observable<Solicitacao>;
  pagar(id: number): Observable<Solicitacao>;
}

