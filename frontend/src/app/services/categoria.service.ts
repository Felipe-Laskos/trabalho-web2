import { Injectable } from '@angular/core';
import { CategoriaEquipamento } from '../models/categoria.model';
import { mockCategoria } from '../mocks/categoria.mock';

const LS_CHAVE = "categorias";

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor() {
    if (!localStorage[LS_CHAVE]) {
      localStorage[LS_CHAVE] = JSON.stringify(mockCategoria);
    }
  }

  listarTodos(): CategoriaEquipamento[] {
    const categorias = localStorage[LS_CHAVE];
    return categorias ? JSON.parse(categorias) : [];
  }

  listarAtivas(): CategoriaEquipamento[] {
    return this.listarTodos().filter(c => c.estadoAtual === 'ATIVA');
  }

  buscarPorId(id: number): CategoriaEquipamento | undefined {
    const categorias = this.listarTodos();
    return categorias.find(c => c.id === id);
  }

  inserir(categoria: CategoriaEquipamento): void {
    const categorias = this.listarTodos();
    categoria.id = new Date().getTime();
    categorias.push(categoria);
    localStorage[LS_CHAVE] = JSON.stringify(categorias);
  }

  atualizar(categoria: CategoriaEquipamento): void {
    const categorias = this.listarTodos();
    categorias.forEach((obj, index, objs) => {
      if (categoria.id === obj.id) {
        objs[index] = categoria;
      }
    });
    localStorage[LS_CHAVE] = JSON.stringify(categorias);
  }

  remover(id: number): void {
    const categorias = this.listarTodos();
    const categoria = categorias.find(c => c.id === id);
    if (categoria) {
      categoria.estadoAtual = 'INATIVA';
      localStorage[LS_CHAVE] = JSON.stringify(categorias);
    }
  }
}
