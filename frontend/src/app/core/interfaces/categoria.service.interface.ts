import { CategoriaEquipamento } from "../../models/categoria.model";

export abstract class ICategoriaService {
 abstract listarTodos(): CategoriaEquipamento[];
  abstract listarAtivas(): CategoriaEquipamento[];
  abstract buscarPorId(id: number): CategoriaEquipamento | undefined;
  abstract inserir(categoria: CategoriaEquipamento): void;
  abstract atualizar(categoria: CategoriaEquipamento): void;
  abstract remover(id: number): void;
}