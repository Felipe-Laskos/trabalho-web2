import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ISolicitacaoService } from '../interfaces/solicitacao.service.interface';
import { Solicitacao } from '../models/solicitacao.model';
import { mockSolicitacao } from '../mocks/solicitacao.mock';

const LS_CHAVE = "solicitacoes";

@Injectable({
  providedIn: 'root'
})
export class SolicitacaoService implements ISolicitacaoService {

  constructor(private http: HttpClient) {
    if (!localStorage[LS_CHAVE]) {
      localStorage[LS_CHAVE] = JSON.stringify(mockSolicitacao);
    }
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