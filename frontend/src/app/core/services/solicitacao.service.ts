import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISolicitacaoService } from '../interfaces/solicitacao.service.interface';
import { Solicitacao, SolicitacaoCreateRequest } from '../models/solicitacao.model';
import { API_URL, defaultHttpOptions } from '../config/http.config';
import { SolicitacaoENUM } from '../models/solicitacaoENUM.model';
import { Page } from '../models/page.model';

@Injectable({
  providedIn: 'root',
})
export class SolicitacaoService implements ISolicitacaoService {
  private base = `${API_URL}/solicitacoes`;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Solicitacao[]> {

  return this.http.get<Solicitacao[]>(
    this.base,
    defaultHttpOptions
  );
}

  listarTodosPaginado(
    page = 0,
    size = 4
  ): Observable<Page<Solicitacao>> {

    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<Page<Solicitacao>>(
      this.base,
      {
        ...defaultHttpOptions,
        params
      }
    );
  }

  buscarPorId(id: number): Observable<Solicitacao> {
    return this.http.get<Solicitacao>(`${this.base}/${id}`, defaultHttpOptions);
  }

  inserir(solicitacao: SolicitacaoCreateRequest): Observable<Solicitacao> {
    return this.http.post<Solicitacao>(this.base, solicitacao, defaultHttpOptions);
  }

  aprovar(id: number): Observable<Solicitacao> {
    return this.http.patch<Solicitacao>(`${this.base}/${id}/aprovar`, {}, defaultHttpOptions);
  }

  rejeitar(id: number, motivo: string): Observable<Solicitacao> {
    const params = new HttpParams().set('motivoRejeicao', motivo);
    const opcoes = { headers: defaultHttpOptions.headers, params: params };

    return this.http.patch<Solicitacao>(`${this.base}/${id}/rejeitar`, {}, opcoes);
  }

  resgatar(id: number): Observable<Solicitacao> {
    return this.http.patch<Solicitacao>(`${this.base}/${id}/resgatar`, {}, defaultHttpOptions);
  }

  pagar(id: number): Observable<Solicitacao> {
    return this.http.patch<Solicitacao>(`${this.base}/${id}/pagar`, {}, defaultHttpOptions);
  }

  atualizar(solicitacao: Solicitacao): Observable<Solicitacao> {
    return this.http.patch<Solicitacao>(`${this.base}/${solicitacao.id}`, solicitacao, defaultHttpOptions);
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`, defaultHttpOptions);
  }

  listarPorCliente(clienteId: number): Observable<Solicitacao[]> {
    return this.http.get<Solicitacao[]>(`${this.base}/cliente/${clienteId}`, defaultHttpOptions);
  }

  redirecionar(id: number, idFuncionarioDestino: number): Observable<Solicitacao> {
    return this.http.patch<Solicitacao>(
      `${this.base}/${id}/redirecionar`,
      { idFuncionarioDestino },
      defaultHttpOptions
    );
  }

  efetuarManutencao(
    id: number,
    dto: { descricaoManutencao: string; orientacoesCliente: string }
  ): Observable<Solicitacao> {
    return this.http.patch<Solicitacao>(
      `${this.base}/${id}/efetuar-manutencao`,
      dto,
      defaultHttpOptions
    );
  }

  finalizar(id: number): Observable<Solicitacao> {
    return this.http.patch<Solicitacao>(
      `${this.base}/${id}/finalizar`,
      {},
      defaultHttpOptions
    );
  }

  listarPorEstado(estado: SolicitacaoENUM): Observable<Solicitacao[]> {
    const params = new HttpParams().set('estadoAtual', estado);

    return this.http.get<Solicitacao[]>(
      `${this.base}/estado`,
      {
        ...defaultHttpOptions,
        params
      }
    );
  }

  orcar(id: number, valor: number): Observable<Solicitacao> {
    return this.http.patch<Solicitacao>(
      `${this.base}/${id}/orcar`,
      { valor },
      defaultHttpOptions
    );
  }

  listarComFiltros(
    filtro: string,
    page = 0,
    size = 4,
    dataInicio?: string,
    dataFim?: string
  ): Observable<Page<Solicitacao>> {
  let params = new HttpParams()
    .set('filtro', filtro)
    .set('page', page)
    .set('size', size);
    if (dataInicio) {
    params = params.set('dataInicio', dataInicio);
  }

  if (dataFim) {
    params = params.set('dataFim', dataFim);
  }

  const opcoes = {
    headers: defaultHttpOptions.headers,
    params
  };

  return this.http.get<Page<Solicitacao>>(
    `${this.base}/filtros`,
    opcoes
  );
}

  gerarRelatorioPeriodoPdf(
    dataInicio?: string,
    dataFim?: string
  ): Observable<Blob> {

    let params = new HttpParams();

    if (dataInicio) {
      params = params.set('inicio', dataInicio);
    }

    if (dataFim) {
      params = params.set('fim', dataFim);
    }

  return this.http.get(
    `${API_URL}/relatorios/receitas-periodo/pdf`,
      {
        ...defaultHttpOptions,
        params,
        responseType: 'blob'
      }
    );
  }

  buscarReceitasPeriodo(
  dataInicio: string,
  dataFim: string
): Observable<any[]> {

  const params = new HttpParams()
    .set('dataInicio', dataInicio)
    .set('dataFim', dataFim);

  return this.http.get<any[]>(
    `${API_URL}/relatorios/receitas-periodo`,
    {
      ...defaultHttpOptions,
      params
    }
  );
}
}
