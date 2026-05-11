import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Funcionario } from '../models/funcionario.model';
import { mockFuncionario } from '../mocks/funcionario.mock';
import { IFuncionarioService } from '../interfaces/funcionario.service.interface';

const LS_CHAVE = "funcionarios";

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService implements IFuncionarioService {

  constructor(private http: HttpClient) {
    if (!localStorage[LS_CHAVE]) {
      localStorage[LS_CHAVE] = JSON.stringify(mockFuncionario);
    }
  }

  listarTodos(): Funcionario[] {
    const funcionarios = localStorage[LS_CHAVE];
    return funcionarios ? JSON.parse(funcionarios) : [];
  }

  buscarPorId(id: number): Funcionario | undefined {
    const funcionarios = this.listarTodos();
    return funcionarios.find(f => f.id === id);
  }

  buscarPorEmail(email: string): Funcionario | undefined {
    const funcionarios = this.listarTodos();
    return funcionarios.find(f => f.email === email);
  }

  buscarPorCpf(cpf: string): Funcionario | undefined {
    const cpfLimpo = cpf.replace(/\D/g, '');
    return this.listarTodos().find(f =>
      f.cpf.replace(/\D/g, '') === cpfLimpo
    );
  }

  inserir(funcionario: Funcionario): void {
    const funcionarios = this.listarTodos();
    const maiorId = funcionarios.length > 0 ? Math.max(...funcionarios.map(f => f.id || 0)) : 0;
    funcionario.id = maiorId + 1;
    funcionarios.push(funcionario);
    localStorage[LS_CHAVE] = JSON.stringify(funcionarios);
  }

  atualizar(funcionario: Funcionario): void {
    const funcionarios = this.listarTodos();
    funcionarios.forEach((obj, index, objs) => {
      if (funcionario.id === obj.id) {
        objs[index] = funcionario;
      }
    });
    localStorage[LS_CHAVE] = JSON.stringify(funcionarios);
  }

  listarAtivos(): Funcionario[] {
    return this.listarTodos().filter(f => f.ativo === true);
  }

  remover(id: number): void {
    const funcionarios = this.listarTodos();
    const funcionario = funcionarios.find(f => f.id === id);
    if (funcionario) {
      funcionario.ativo = false;
      localStorage[LS_CHAVE] = JSON.stringify(funcionarios);
    }
  }
}