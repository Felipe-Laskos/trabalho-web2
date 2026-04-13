import { CategoriaEquipamento } from "../models/categoria.model";

export interface ICategoriaService {
  listarTodos(): CategoriaEquipamento[];
  listarAtivas(): CategoriaEquipamento[];
  buscarPorId(id: number): CategoriaEquipamento | undefined;
  inserir(categoria: CategoriaEquipamento): void;
  atualizar(categoria: CategoriaEquipamento): void;
  remover(id: number): void;
}