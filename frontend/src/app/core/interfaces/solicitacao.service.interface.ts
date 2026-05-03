import { Observable } from "rxjs";
import { Solicitacao } from "../models/solicitacao.model";
import { SolicitacaoENUM } from "../models/solicitacaoENUM.model";
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

  listarPorEstado(estado: SolicitacaoENUM): Observable<Solicitacao[]>;
  orcar(id: number, valor: number): Observable<Solicitacao>;

  listarComFiltros(
    filtro: string,
    dataInicio?: string,
    dataFim?: string
  ): Observable<Solicitacao[]>;

  redirecionar(
    id: number,
    idFuncionarioDestino: number
  ): Observable<Solicitacao>;

  efetuarManutencao(
    id: number,
    dto: {
      descricaoManutencao: string;
      orientacoesCliente: string;
    }
  ): Observable<Solicitacao>;

  finalizar(id: number): Observable<Solicitacao>;
}