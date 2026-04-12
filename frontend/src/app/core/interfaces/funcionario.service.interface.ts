import { Funcionario } from '../../models/funcionario.model';

export abstract class IFuncionarioService {
  abstract listarTodos(): Funcionario[];
  abstract buscarPorId(id: number): Funcionario | undefined;
  abstract buscarPorEmail(email: string): Funcionario | undefined;
  abstract buscarPorCpf(cpf: string): Funcionario | undefined;
  abstract listarAtivos(): Funcionario[];
  abstract inserir(funcionario: Funcionario): void;
  abstract atualizar(funcionario: Funcionario): void;
  abstract remover(id: number): void;
}