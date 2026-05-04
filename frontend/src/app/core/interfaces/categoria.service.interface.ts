import { Observable } from "rxjs/internal/Observable";
import { CategoriaEquipamento } from "../models/categoria.model";

export interface ICategoriaService {
  listarTodos(): Observable<CategoriaEquipamento[]>;
  listarAtivas(): Observable<CategoriaEquipamento[]>;
  buscarPorId(id: number): Observable<CategoriaEquipamento | undefined>;
  inserir(categoria: CategoriaEquipamento): Observable<CategoriaEquipamento>;
  atualizar(categoria: CategoriaEquipamento): Observable<CategoriaEquipamento>;
  remover(id: number): Observable<CategoriaEquipamento>;
}