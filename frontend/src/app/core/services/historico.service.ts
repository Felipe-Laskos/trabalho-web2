import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HistoricoSolicitacao } from '../models/historico.model';
import { API_URL, defaultHttpOptions } from '../config/http.config';
import { IHistoricoService } from '../interfaces/historico.service.interface';

@Injectable({
  providedIn: 'root'
})
export class HistoricoService implements IHistoricoService {
  private base = `${API_URL}/historicos`; 

  constructor(private http: HttpClient) { }
 
  //TODO: remover esta função: histórico só é exposto na hora de visualizar solicitação (via listarPorSolicitacao)
  listarTodos(): Observable<HistoricoSolicitacao[]> {
    return this.http.get<HistoricoSolicitacao[]>(`${this.base}/historico`, defaultHttpOptions);
  }

  listarPorSolicitacao(solicitacaoId: number): Observable<HistoricoSolicitacao[]> {
   return this.http.get<HistoricoSolicitacao[]>(`${API_URL}/solicitacoes/${solicitacaoId}/historico`, defaultHttpOptions);
  }

  //TODO remover esta função: histórico só é persistido na hora de criar/movimentar uma solicitação via backend
  inserir(historico: HistoricoSolicitacao): Observable<HistoricoSolicitacao> {
    return this.http.post<HistoricoSolicitacao>(`${this.base}/historico`, historico, defaultHttpOptions);
  }
  }
