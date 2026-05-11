import { Observable } from "rxjs";
import { Solicitacao } from "../models/solicitacao.model";
import { Page } from "../dto/page.dto";

export interface ISolicitacaoService {
  
  // Atualizado para receber parâmetros de página e retornar Page<> em vez de array puro
  listarTodos(page?: number, size?: number): Observable<Page<Solicitacao>>;
  // Novo endpoint filtros com paginação
  listarComFiltros(filtro: string, dataInicio?: string, dataFim?: string, page?: number, size?: number): Observable<Page<Solicitacao>>;
  buscarPorId(id: number): Observable<Solicitacao>;
  inserir(solicitacao: Solicitacao): Observable<Solicitacao>;
  atualizar(solicitacao: Solicitacao): Observable<Solicitacao>;
  remover(id: number): Observable<void>;
  aprovar(id: number): Observable<Solicitacao>;
  rejeitar(id: number, motivo: string): Observable<Solicitacao>;
  resgatar(id: number): Observable<Solicitacao>;
  pagar(id: number): Observable<Solicitacao>;
  redirecionar(id: number, idFuncionarioDestino: number): Observable<Solicitacao>;
  efetuarManutencao(
    id: number,
    dto: { descricaoManutencao: string; orientacoesCliente: string }
  ): Observable<Solicitacao>;
}