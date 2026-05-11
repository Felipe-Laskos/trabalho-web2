import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { ClienteRequest } from '../dto/request/cliente-request.model';
import { ClienteResponse } from '../dto/response/cliente-response.model';

export interface IClienteService {
  autocadastrar(requisicao: ClienteRequest): Observable<ClienteResponse>;
  listarTodos(): Cliente[];
  buscarPorId(id: number): Cliente | undefined;
  buscarPorEmail(email: string): Cliente | undefined;
  buscarPorCpf(cpf: string): Cliente | undefined;
  inserir(cliente: Cliente): void;
  atualizar(cliente: Cliente): void;
  remover(id: number): void;
}