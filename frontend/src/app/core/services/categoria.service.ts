import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CategoriaEquipamento } from '../models/categoria.model';
import { mockCategoria } from '../mocks/categoria.mock';
import { ICategoriaService } from '../interfaces/categoria.service.interface';

const LS_CHAVE = "categorias";

@Injectable({
  providedIn: 'root'
})
export class CategoriaService implements ICategoriaService {

  constructor(private http: HttpClient) {
    if (!localStorage[LS_CHAVE]) {
      localStorage[LS_CHAVE] = JSON.stringify(mockCategoria);
    }
  }

  listarTodos(): CategoriaEquipamento[] {
    const categorias = localStorage[LS_CHAVE];
    return categorias ? JSON.parse(categorias) : [];
  }

  listarAtivas(): CategoriaEquipamento[] {
    return this.listarTodos().filter(c => c.ativo === true);
  }

  buscarPorId(id: number): CategoriaEquipamento | undefined {
    const categorias = this.listarTodos();
    return categorias.find(c => c.id === id);
  }

  inserir(categoria: CategoriaEquipamento): void {
    const categorias = this.listarTodos();
    const maiorId = categorias.length > 0 ? Math.max(...categorias.map(c => c.id || 0)) : 0;
    categoria.id = maiorId + 1;
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
    const categoria = categorias.find(c => Number(c.id) === Number(id));
    if (categoria) {
      categoria.ativo = false;
      localStorage[LS_CHAVE] = JSON.stringify(categorias);
    }
  }
}