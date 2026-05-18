import { Observable } from "rxjs/internal/Observable";
import { CategoriaEquipamento } from "../models/categoria.model";
import { Page } from "../dto/response/page.dto";

export interface ICategoriaService {
  listarTodos(page: number, size: number): Observable<Page<CategoriaEquipamento>>;
  listarAtivas(): Observable<CategoriaEquipamento[]>;
  buscarPorId(id: number): Observable<CategoriaEquipamento | undefined>;
  inserir(categoria: CategoriaEquipamento): Observable<CategoriaEquipamento>;
  atualizar(categoria: CategoriaEquipamento): Observable<CategoriaEquipamento>;
  remover(id: number): Observable<CategoriaEquipamento>;
}