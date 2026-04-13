import { Cliente } from '../models/cliente.model';

export interface IClienteService {
  listarTodos(): Cliente[];
  buscarPorId(id: number): Cliente | undefined;
  buscarPorEmail(email: string): Cliente | undefined;
  buscarPorCpf(cpf: string): Cliente | undefined;
  inserir(cliente: Cliente): void;
  atualizar(cliente: Cliente): void;
  remover(id: number): void;
}