import { Injectable } from '@angular/core';
import { Cliente } from '../models/cliente.model';
import { mockCliente } from '../mocks/clientes.mock';

const LS_CHAVE = "clientes";

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor() {
    if (!localStorage[LS_CHAVE]) {
      localStorage[LS_CHAVE] = JSON.stringify(mockCliente);
    }
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

  remover(id: number): void {
    let clientes = this.listarTodos();
    clientes = clientes.filter(c => c.id !== id);
    localStorage[LS_CHAVE] = JSON.stringify(clientes);
  }
}
