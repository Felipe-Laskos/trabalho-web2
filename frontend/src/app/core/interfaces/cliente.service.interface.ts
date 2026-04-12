import { Cliente } from '../../models/cliente.model';

export abstract class IClienteService {
  abstract listarTodos(): Cliente[];
  abstract buscarPorId(id: number): Cliente | undefined;
  abstract buscarPorEmail(email: string): Cliente | undefined;
  abstract buscarPorCpf(cpf: string): Cliente | undefined;
  abstract inserir(cliente: Cliente): void;
  abstract atualizar(cliente: Cliente): void;
  abstract remover(id: number): void;
}