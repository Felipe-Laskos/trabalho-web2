import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISolicitacaoService } from '../interfaces/solicitacao.service.interface';
import { Solicitacao } from '../models/solicitacao.model';
import { SolicitacaoENUM } from '../models/solicitacaoENUM.model';

@Injectable({
  providedIn: 'root',
})
export class SolicitacaoService implements ISolicitacaoService {
  private readonly API_URL = 'http://localhost:8080/api/solicitacoes';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Solicitacao[]> {
    return this.http.get<Solicitacao[]>(this.API_URL);
  } 

  buscarPorId(id: number): Observable<Solicitacao> {
    return this.http.get<Solicitacao>(`${this.API_URL}/${id}`);
  } 

  inserir(solicitacao: Solicitacao): Observable<Solicitacao> {
    return this.http.post<Solicitacao>(this.API_URL, solicitacao);
  }

  aprovar(id: number): Observable<Solicitacao> {
    return this.http.patch<Solicitacao>(`${this.API_URL}/${id}/aprovar`, {});
  }

  rejeitar(id: number, motivo: string): Observable<Solicitacao> {
    return this.http.patch<Solicitacao>(
      `${this.API_URL}/${id}/rejeitar?motivoRejeicao=${motivo}`,
      {},
    );
  }

  resgatar(id: number): Observable<Solicitacao> {
    return this.http.patch<Solicitacao>(`${this.API_URL}/${id}/resgatar`, {});
  }

  pagar(id: number): Observable<Solicitacao> {
    return this.http.patch<Solicitacao>(`${this.API_URL}/${id}/pagar`, {});
  }

  atualizar(solicitacao: Solicitacao): Observable<Solicitacao> {
    return this.http.put<Solicitacao>(
      `${this.API_URL}/${solicitacao.id}`,
      solicitacao,
    );
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
