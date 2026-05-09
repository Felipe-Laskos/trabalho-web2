import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { IClienteService } from '../interfaces/cliente.service.interface';
import { ClienteRequest } from '../dto/request/cliente-request.model';
import { ClienteResponse } from '../dto/response/cliente-response.model';
import { API_URL, defaultHttpOptions } from '../config/http.config';

const LS_CHAVE = "clientes";

@Injectable({
  providedIn: 'root'
})
export class ClienteService implements IClienteService {
  private apiUrl = `${API_URL}/clientes`;

  constructor(private http: HttpClient) {}

  autocadastrar(requisicao: ClienteRequest): Observable<ClienteResponse> {
    return this.http.post<ClienteResponse>(this.apiUrl, requisicao, defaultHttpOptions);
  }

  // FUNÇÕES EXTRAS/AUXILIARES PARA OUTRAS TELAS

  listarTodos(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(
      this.apiUrl, 
      defaultHttpOptions).pipe(
        map(response => response),
        catchError(error => {
          console.error('Erro ao listar clientes:', error);
          throw error;
        })
      );
  }

  buscarPorId(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(
      `${this.apiUrl}/${id}`,
      defaultHttpOptions
    ).pipe(
      catchError(error => {
        console.error(`Erro ao buscar cliente ${id}:`, error);
        throw error;
      })
    );
  }

  buscarPorEmail(email: string): Observable<Cliente> {
    return this.http.get<Cliente>(
      `${this.apiUrl}?email=${email}`,
      defaultHttpOptions
    ).pipe(
      catchError(error => {
        console.error(`Erro ao buscar cliente por email ${email}:`, error);
        throw error;
      })
    );
  }

  buscarPorCpf(cpf: string): Observable<Cliente> {
    return this.http.get<Cliente>(
      `${this.apiUrl}?cpf=${cpf}`,
      defaultHttpOptions
    ).pipe(
      catchError(error => {
        console.error(`Erro ao buscar cliente por CPF ${cpf}:`, error);
        throw error;
      })
    );
  }

  inserir(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(
      this.apiUrl, 
      cliente, 
      defaultHttpOptions).pipe(
        map(response => {
          console.log('Cliente inserido com sucesso:', response);
          return response;
        }),
        catchError(error => {
          console.error('Erro ao inserir cliente:', error);
          throw error;
        })
      )
    }

  atualizar(cliente: Cliente): Observable<Cliente> {
    return this.http.patch<Cliente>(
      `${this.apiUrl}/${cliente.id}`,
      cliente,
      defaultHttpOptions
    ).pipe(
      map(response => {
        console.log('Cliente atualizado com sucesso:', response);
        return response;
      }),
      catchError(error => {
        console.error('Erro ao atualizar cliente:', error);
        throw error;
      })
    );
  }


  listarAtivos(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(
      this.apiUrl, 
      defaultHttpOptions)
    .pipe(
      map(response => response.filter(c => c.ativo === true)),
      catchError(error => {
        console.error('Erro ao listar clientes ativos:', error);
        throw error;
      })
    );
  }

  remover(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(
      `${this.apiUrl}/${id}`,
      defaultHttpOptions
    ).pipe(
      map(response => {
        console.log('Cliente removido com sucesso:', response);
        return response;
      }),
      catchError(error => {
        console.error('Erro ao remover cliente:', error);
        throw error;
      })
    );
  }
}