import { Injectable } from '@angular/core';
import { Funcionario } from '../models/funcionario.model';
import { mockFuncionario } from '../mocks/funcionario.mock';

const LS_CHAVE = "funcionarios";

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {

  constructor() {
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

  inserir(funcionario: Funcionario): void {
    const funcionarios = this.listarTodos();
    funcionario.id = new Date().getTime();
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

  remover(id: number): void {
    let funcionarios = this.listarTodos();
    funcionarios = funcionarios.filter(f => f.id !== id);
    localStorage[LS_CHAVE] = JSON.stringify(funcionarios);
  }
}
