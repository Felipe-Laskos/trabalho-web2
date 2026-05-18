import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { IClienteService } from '../interfaces/cliente.service.interface';
import { ClienteRequest } from '../dto/request/cliente-request.model';
import { ClienteResponse } from '../dto/response/cliente-response.model';
import { API_URL, defaultHttpOptions } from '../config/http.config';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService implements IClienteService {
  private apiUrl = `${API_URL}/clientes`;

  constructor(private http: HttpClient, private snackBar: MatSnackBar, private notificationService: NotificationService) {}

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
          this.notificationService.exibirErro('Erro ao listar clientes.');
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
        this.notificationService.exibirErro(`Erro ao buscar cliente ${id}.`);
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
        this.notificationService.exibirErro(`Erro ao buscar cliente por email ${email}.`);
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
        this.notificationService.exibirErro(`Erro ao buscar cliente por CPF ${cpf}.`);
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
            this.snackBar.open(
          'Cliente inserido com sucesso!',
          'Fechar',
          {
            duration: 3000
          }
        );
          return response;
        }),
        catchError(error => {
          this.notificationService.exibirErro('Erro ao inserir cliente.');
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
        this.snackBar.open(
          'Cliente atualizado com sucesso!',
          'Fechar',
          {
            duration: 3000
          }
        );
        return response;
      }),
      catchError(error => {
        this.notificationService.exibirErro('Erro ao atualizar cliente.');
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
        this.notificationService.exibirErro('Erro ao listar clientes ativos.');
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
        this.notificationService.exibirSucesso('Cliente removido com sucesso.');
        return response;
      }),
      catchError(error => {
        this.notificationService.exibirErro('Erro ao remover cliente.');
        throw error;
      })
    );
  }
}