import { Funcionario } from '../models/funcionario.model';

export interface IFuncionarioService {
  listarTodos(): Funcionario[];
  buscarPorId(id: number): Funcionario | undefined;
  buscarPorEmail(email: string): Funcionario | undefined;
  buscarPorCpf(cpf: string): Funcionario | undefined;
  listarAtivos(): Funcionario[];
  inserir(funcionario: Funcionario): void;
  atualizar(funcionario: Funcionario): void;
  remover(id: number): void;
}