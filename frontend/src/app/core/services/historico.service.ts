import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { HistoricoSolicitacao } from '../models/historico.model';
import { API_URL, defaultHttpOptions } from '../config/http.config';
import { IHistoricoService } from '../interfaces/historico.service.interface';

@Injectable({
  providedIn: 'root'
})
export class HistoricoService implements IHistoricoService {
  private base = `${API_URL}/historicos`; 

  constructor(private http: HttpClient) { }

  listarTodos(): Observable<HistoricoSolicitacao[]> {
    return this.http.get<HistoricoSolicitacao[]>(`${this.base}/historico`, defaultHttpOptions);
  }

  listarPorSolicitacao(solicitacaoId: number): Observable<HistoricoSolicitacao[]> {
   return this.http.get<HistoricoSolicitacao[]>(`${API_URL}/solicitacoes/${solicitacaoId}/historico`, defaultHttpOptions);
  }

  inserir(historico: HistoricoSolicitacao): Observable<HistoricoSolicitacao> {
    return this.http.post<HistoricoSolicitacao>(`${this.base}/historico`, historico, defaultHttpOptions);
  }
  }
