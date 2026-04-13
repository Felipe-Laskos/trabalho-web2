import { Solicitacao } from "../models/solicitacao.model"; 

export interface ISolicitacaoService {
  listarTodos(): Solicitacao[];
  buscarPorId(id: number): Solicitacao | undefined;
  inserir(solicitacao: Solicitacao): void;
  atualizar(solicitacao: Solicitacao): void;
  remover(id: number): void;
}