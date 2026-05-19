import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HistoricoSolicitacao } from '../models/historico.model';
import { API_URL, defaultHttpOptions } from '../config/http.config';
import { IHistoricoService } from '../interfaces/historico.service.interface';
import { Page } from '../dto/response/page.dto';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class HistoricoService implements IHistoricoService {
  private base = `${API_URL}/historicos`; 
  private notificationService: NotificationService;

  constructor(private http: HttpClient, notificationService: NotificationService) {
    this.notificationService = notificationService;
  }

  //TODO: remover esta função: histórico só é exposto na hora de visualizar solicitação (via listarPorSolicitacao)
  listarTodos(): Observable<HistoricoSolicitacao[]> {
    return this.http.get<HistoricoSolicitacao[]>(`${this.base}/historico`, defaultHttpOptions);
  }

  listarPorSolicitacao(solicitacaoId: number): Observable<HistoricoSolicitacao[]> {
    return this.http.get<Page<HistoricoSolicitacao> | HistoricoSolicitacao[]>(
      `${API_URL}/solicitacoes/${solicitacaoId}/historico`,
      defaultHttpOptions
    ).pipe(
      map(response => Array.isArray(response) ? response : response.content)
    );
  }
}
