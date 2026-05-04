import { Observable } from 'rxjs/internal/Observable';
import { Funcionario } from '../models/funcionario.model';

export interface IFuncionarioService {
  listarTodos(): Observable<Funcionario[]>;
  buscarPorId(id: number): Observable<Funcionario | undefined>;
  buscarPorEmail(email: string): Observable<Funcionario | undefined>;
  buscarPorCpf(cpf: string): Observable<Funcionario | undefined>;
  listarAtivos(): Observable<Funcionario[]>;
  inserir(funcionario: Funcionario): Observable<Funcionario>;
  atualizar(funcionario: Funcionario): Observable<Funcionario>;
  remover(id: number): Observable<Funcionario>;
}