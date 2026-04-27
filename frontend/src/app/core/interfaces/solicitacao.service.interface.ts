import { Observable } from "rxjs";
import { Solicitacao } from "../models/solicitacao.model"; 

export interface ISolicitacaoService {
  listarTodos(): Solicitacao[];
  buscarPorId(id: number): Solicitacao | undefined;
  inserir(solicitacao: Solicitacao): void;
  atualizar(solicitacao: Solicitacao): void;
  remover(id: number): void;
  redirecionar(id: number, idFuncionarioLogado: number, idFuncionarioDestino: number): Observable<Solicitacao>;
  efetuarManutencaoSecundaria(id: number): Observable<Solicitacao>;
}