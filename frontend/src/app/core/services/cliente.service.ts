import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { mockCliente } from '../mocks/clientes.mock';
import { IClienteService } from '../interfaces/cliente.service.interface';
import { ClienteRequest } from '../dto/request/cliente-request.model';
import { ClienteResponse } from '../dto/response/cliente-response.model';
import { API_URL, defaultHttpOptions } from '../config/http.config';

const LS_CHAVE = "clientes";

@Injectable({
  providedIn: 'root'
})
export class ClienteService implements IClienteService {

  constructor(private http: HttpClient) {
    if (!localStorage[LS_CHAVE]) {
      localStorage[LS_CHAVE] = JSON.stringify(mockCliente);
    }
  }

  autocadastrar(requisicao: ClienteRequest): Observable<HttpResponse<ClienteResponse>> {
    return this.http.post<ClienteResponse>(`${API_URL}/clientes`, requisicao, defaultHttpOptions);
  }

  listarTodos(): Cliente[] {
    const clientes = localStorage[LS_CHAVE];
    return clientes ? JSON.parse(clientes) : [];
  }

  buscarPorId(id: number): Cliente | undefined {
    const clientes = this.listarTodos();
    return clientes.find(c => c.id === id);
  }

  buscarPorEmail(email: string): Cliente | undefined {
    const clientes = this.listarTodos();
    return clientes.find(c => c.email === email);
  }

  buscarPorCpf(cpf: string): Cliente | undefined {
    const cpfLimpo = cpf.replace(/\D/g, '');
    return this.listarTodos().find(c =>
      c.cpf.replace(/\D/g, '') === cpfLimpo
    );
  }

  inserir(cliente: Cliente): void {
    const clientes = this.listarTodos();
    cliente.id = new Date().getTime();
    clientes.push(cliente);
    localStorage[LS_CHAVE] = JSON.stringify(clientes);
  }

  atualizar(cliente: Cliente): void {
    const clientes = this.listarTodos();
    clientes.forEach((obj, index, objs) => {
      if (cliente.id === obj.id) {
        objs[index] = cliente;
      }
    });
    localStorage[LS_CHAVE] = JSON.stringify(clientes);
  }

  listarAtivos(): Cliente[] {
    return this.listarTodos().filter(c => c.ativo === true);
  }

  remover(id: number): void {
    const clientes = this.listarTodos();
    const cliente = clientes.find(c => c.id === id);
    if (cliente) {
      cliente.ativo = false;
      localStorage[LS_CHAVE] = JSON.stringify(clientes);
    }
  }
}