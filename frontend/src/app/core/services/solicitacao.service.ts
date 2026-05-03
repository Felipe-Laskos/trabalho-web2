import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISolicitacaoService } from '../interfaces/solicitacao.service.interface';
import { Solicitacao } from '../models/solicitacao.model';
import { API_URL, defaultHttpOptions } from '../config/http.config';

@Injectable({
  providedIn: 'root',
})
export class SolicitacaoService implements ISolicitacaoService {
  private base = `${API_URL}/solicitacoes`;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Solicitacao[]> {
    return this.http.get<Solicitacao[]>(this.base, defaultHttpOptions);
  }

  buscarPorId(id: number): Observable<Solicitacao> {
    return this.http.get<Solicitacao>(`${this.base}/${id}`, defaultHttpOptions);
  }

  inserir(solicitacao: Solicitacao): Observable<Solicitacao> {
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
}