import { Solicitacao } from "../../models/solicitacao.model";

export abstract class ISolicitacaoService {
  abstract listarTodos(): Solicitacao[];
  abstract buscarPorId(id: number): Solicitacao | undefined;
  abstract inserir(solicitacao: Solicitacao): void;
  abstract atualizar(solicitacao: Solicitacao): void;
  abstract remover(id: number): void;
}