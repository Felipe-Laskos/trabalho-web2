import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { ClienteRequest } from '../dto/request/cliente-request.model';
import { ClienteResponse } from '../dto/response/cliente-response.model';

export interface IClienteService {
  autocadastrar(requisicao: ClienteRequest): Observable<ClienteResponse>;
  listarTodos(): Observable<Cliente[]>;
  buscarPorId(id: number): Observable<Cliente>;
  buscarPorEmail(email: string): Observable<Cliente>;
  buscarPorCpf(cpf: string): Observable<Cliente>;
  inserir(cliente: Cliente): Observable<Cliente>;
  atualizar(cliente: Cliente): Observable<Cliente>;
  listarAtivos(): Observable<Cliente[]>;
  remover(id: number): Observable<Cliente>;
}