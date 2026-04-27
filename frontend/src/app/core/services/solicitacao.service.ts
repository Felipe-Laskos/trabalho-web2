import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISolicitacaoService } from '../interfaces/solicitacao.service.interface';
import { Solicitacao } from '../models/solicitacao.model';
import { mockSolicitacao } from '../mocks/solicitacao.mock';

const LS_CHAVE = "solicitacoes";

@Injectable({
  providedIn: 'root'
})
export class SolicitacaoService implements ISolicitacaoService {
  
  private readonly apiUrl = 'http://localhost:8080/api/solicitacoes';

  constructor(private http: HttpClient) {
    if (!localStorage[LS_CHAVE]) {
      localStorage[LS_CHAVE] = JSON.stringify(mockSolicitacao);
    }
  }
  
  redirecionar(id: number, idFuncionarioLogado: number, idFuncionarioDestino: number): Observable<Solicitacao> {
    const payload = { idFuncionarioDestino };
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('X-Funcionario-Id', idFuncionarioLogado.toString());

    return this.http.patch<Solicitacao>(
      `${this.apiUrl}/${id}/redirecionar`, 
      payload, 
      { headers }
    );
  }

  efetuarManutencaoSecundaria(id: number): Observable<Solicitacao> {
    return this.http.patch<Solicitacao>(
      `${this.apiUrl}/${id}/efetuar-manutencao`, 
      {}
    );
  }

  listarTodos(): Solicitacao[] {
    const solicitacoes = localStorage[LS_CHAVE];
    return solicitacoes ? JSON.parse(solicitacoes) : [];
  }

  buscarPorId(id: number): Solicitacao | undefined {
    const solicitacoes = this.listarTodos();
    return solicitacoes.find(s => s.id === id);
  }

  inserir(solicitacao: Solicitacao): void {
    const solicitacoes = this.listarTodos();
    const maiorId = solicitacoes.length > 0
    ? Math.max(...solicitacoes.map(s => s.id || 0))
    : 0;

    solicitacao.id = maiorId + 1;
    solicitacoes.push(solicitacao);
    localStorage[LS_CHAVE] = JSON.stringify(solicitacoes);
  }

  atualizar(solicitacao: Solicitacao): void {
    const solicitacoes = this.listarTodos();
    solicitacoes.forEach((obj, index, objs) => {
      if (solicitacao.id === obj.id) {
        objs[index] = solicitacao;
      }
    });
    localStorage[LS_CHAVE] = JSON.stringify(solicitacoes);
  }

  remover(id: number): void {
    const solicitacoes = this.listarTodos();
    const solicitacao = solicitacoes.find(s => s.id === id);
    if (solicitacao) {
      solicitacao.ativo = false;
      localStorage[LS_CHAVE] = JSON.stringify(solicitacoes);
    }
  }
}