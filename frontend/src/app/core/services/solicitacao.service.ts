import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISolicitacaoService } from '../interfaces/solicitacao.service.interface';
import { Solicitacao, SolicitacaoCreateRequest } from '../models/solicitacao.model';
import { SolicitacaoENUM } from '../models/solicitacaoENUM.model';
import { API_URL, defaultHttpOptions } from '../config/http.config';
import { Page } from '../dto/page.dto';

@Injectable({
  providedIn: 'root',
})
export class SolicitacaoService implements ISolicitacaoService {
  private base = `${API_URL}/solicitacoes`;

  constructor(private http: HttpClient) {}

  listarTodos(page = 0, size = 4): Observable<Page<Solicitacao>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
      
    return this.http.get<Page<Solicitacao>>(this.base, { ...defaultHttpOptions, params });
  }

  listarComFiltros(filtro: string, dataInicio?: string, dataFim?: string, page = 0, size = 4): Observable<Page<Solicitacao>> {
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

    return this.http.get<Page<Solicitacao>>(`${this.base}/filtros`, { ...defaultHttpOptions, params });
  }

  listarPorCliente(clienteId: number, page = 0, size = 4): Observable<Page<Solicitacao>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
      
    return this.http.get<Page<Solicitacao>>(`${this.base}/cliente/${clienteId}`, { ...defaultHttpOptions, params });
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

  redirecionar(id: number, idFuncionarioDestino: number): Observable<Solicitacao> {
    const payload = { idFuncionarioDestino };
    return this.http.patch<Solicitacao>(
      `${this.base}/${id}/redirecionar`, 
      payload, 
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

  listarPorEstado(estado: SolicitacaoENUM): Observable<Solicitacao[]> {
    const params = new HttpParams().set('estadoAtual', estado);
    return this.http.get<Solicitacao[]>(`${this.base}/estado`, { ...defaultHttpOptions, params });
  }

  orcar(id: number, valor: number): Observable<Solicitacao> {
    return this.http.patch<Solicitacao>(`${this.base}/${id}/orcar`, { valor }, defaultHttpOptions);
  }

  finalizar(id: number): Observable<Solicitacao> {
    return this.http.patch<Solicitacao>(`${this.base}/${id}/finalizar`, {}, defaultHttpOptions);
  }
}