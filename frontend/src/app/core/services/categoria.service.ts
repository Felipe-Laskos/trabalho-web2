import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CategoriaEquipamento } from '../models/categoria.model';
import { ICategoriaService } from '../interfaces/categoria.service.interface';
import { API_URL, defaultHttpOptions } from '../config/http.config';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService implements ICategoriaService {
  private apiUrl = `${API_URL}/categorias`;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<CategoriaEquipamento[]> {
    return this.http.get<CategoriaEquipamento[]>(
      this.apiUrl,
      defaultHttpOptions
    ).pipe(
      map(response => response),
      catchError(error => {
        console.error('Erro ao listar categorias:', error);
        throw error;
      })
    );
  }

  listarAtivas(): Observable<CategoriaEquipamento[]> {
    return this.http.get<CategoriaEquipamento[]>(
      `${this.apiUrl}/ativas`,
      defaultHttpOptions
    ).pipe(
      catchError(error => {
        console.error('Erro ao listar categorias ativas:', error);
        throw error;
      })
    );
  }

  buscarPorId(id: number): Observable<CategoriaEquipamento | undefined> {
    return this.http.get<CategoriaEquipamento>(
    `${this.apiUrl}/${id}`,
    defaultHttpOptions
  ).pipe(
    catchError(error => {
      console.error(`Erro ao buscar categoria ${id}:`, error);
      throw error;
    })
  );
}

  inserir(categoria: CategoriaEquipamento): Observable<CategoriaEquipamento> {
    return this.http.post<CategoriaEquipamento>(
      this.apiUrl,
      categoria,
      defaultHttpOptions    
    ).pipe(
      map(response => response),
      catchError(error => {
        console.error('Erro ao inserir categoria:', error);
        throw error;
      })
    );
  }

  atualizar(categoria: CategoriaEquipamento): Observable<CategoriaEquipamento> {
    return this.http.patch<CategoriaEquipamento>(
      `${this.apiUrl}/${categoria.id}`,
      categoria,
      defaultHttpOptions
    ).pipe(
      map(response => response),
      catchError(error => {
        console.error('Erro ao atualizar categoria:', error);
        throw error;
      })
    );
  }

  remover(id: number): Observable<CategoriaEquipamento> {
    return this.http.delete<CategoriaEquipamento>(
      `${this.apiUrl}/${id}`,
      defaultHttpOptions
    ).pipe(
      catchError(error => {
        console.error('Erro ao remover categoria:', error);
        throw error;
      })
    );
  }
}