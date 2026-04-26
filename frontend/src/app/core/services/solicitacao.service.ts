import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISolicitacaoService } from '../interfaces/solicitacao.service.interface';
import { Solicitacao } from '../models/solicitacao.model';
import { API_URL } from '../config/http.config';

@Injectable({
  providedIn: 'root',
})
export class SolicitacaoService implements ISolicitacaoService {
  private base = `${API_URL}/solicitacoes`;
  private get defaultHttpOptions() {
    const token = localStorage.getItem('authToken');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    };
  };

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Solicitacao[]> {
    return this.http.get<Solicitacao[]>(this.base, this.defaultHttpOptions);
  }

  buscarPorId(id: number): Observable<Solicitacao> {
    return this.http.get<Solicitacao>(`${this.base}/${id}`, this.defaultHttpOptions);
  } 

  inserir(solicitacao: Solicitacao): Observable<Solicitacao> {
    return this.http.post<Solicitacao>(this.base, solicitacao, this.defaultHttpOptions);
  }

  aprovar(id: number): Observable<Solicitacao> {
    return this.http.patch<Solicitacao>(`${this.base}/${id}/aprovar`, {}, this.defaultHttpOptions);
  }

  rejeitar(id: number, motivo: string): Observable<Solicitacao> {
    const params = new HttpParams().set('motivoRejeicao', motivo);
    const opcoes = { headers: this.defaultHttpOptions.headers, params: params };

    return this.http.patch<Solicitacao>(`${this.base}/${id}/rejeitar`, {}, opcoes);
  }

  resgatar(id: number): Observable<Solicitacao> {
    return this.http.patch<Solicitacao>(`${this.base}/${id}/resgatar`, {}, this.defaultHttpOptions);
  }

  pagar(id: number): Observable<Solicitacao> {
    return this.http.patch<Solicitacao>(`${this.base}/${id}/pagar`, {}, this.defaultHttpOptions);
  }

  atualizar(solicitacao: Solicitacao): Observable<Solicitacao> {
    return this.http.patch<Solicitacao>(`${this.base}/${solicitacao.id}`, solicitacao, this.defaultHttpOptions); //put
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`, this.defaultHttpOptions);
  }

  listarPorCliente(clienteId: number): Observable<Solicitacao[]> {
    return this.http.get<Solicitacao[]>(`${this.base}/cliente/${clienteId}`, this.defaultHttpOptions);
  }

  efetuarManutencao(solicitacao: Solicitacao): Observable<Solicitacao> {
    return this.http.patch<Solicitacao>(`${this.base}/${solicitacao.id}/efetuar-manutencao`, solicitacao, this.defaultHttpOptions);
  }

   redirecionar(solicitacao: Solicitacao): Observable<Solicitacao> {
    return this.http.patch<Solicitacao>(`${this.base}/${solicitacao.id}/redirecionar`, solicitacao, this.defaultHttpOptions);
  }
}
