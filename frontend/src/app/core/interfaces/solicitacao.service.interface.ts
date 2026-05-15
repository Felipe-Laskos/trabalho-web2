import { Observable } from "rxjs";
import { Solicitacao, SolicitacaoCreateRequest } from "../models/solicitacao.model";
import { SolicitacaoENUM } from "../models/solicitacaoENUM.model";
import { Page } from "../dto/response/page-response.model";
export interface ISolicitacaoService {
  listarTodos(): Observable<Solicitacao[]>;
  listarTodosPaginado(
    page?: number,
    size?: number
  ): Observable<Page<Solicitacao>>;  
  buscarPorId(id: number): Observable<Solicitacao>;
  inserir(solicitacao: SolicitacaoCreateRequest): Observable<Solicitacao>;
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
    page?: number,
    size?: number,
    dataInicio?: string,
    dataFim?: string
  ): Observable<Page<Solicitacao>>;

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

    gerarRelatorioPeriodoPdf(
    dataInicio?: string,
    dataFim?: string
  ): Observable<Blob>;
}
