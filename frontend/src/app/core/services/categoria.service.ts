import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CategoriaEquipamento } from '../models/categoria.model';
import { ICategoriaService } from '../interfaces/categoria.service.interface';
import { API_URL, defaultHttpOptions } from '../config/http.config';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, map } from 'rxjs';
import { NotificationService } from './notification.service';
import { Page } from '../dto/response/page.dto';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService implements ICategoriaService {
  private apiUrl = `${API_URL}/categorias`;

  constructor(private http: HttpClient, private notificationService: NotificationService) {}

  listarTodos(page: number, size: number): Observable<Page<CategoriaEquipamento>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<Page<CategoriaEquipamento>>(
      this.apiUrl,
      {
        params,
        ...defaultHttpOptions
      }
    ).pipe(
      catchError(error => {
        this.notificationService.exibirErro(
          'Erro ao listar categorias.'
        );
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
        this.notificationService.exibirErro('Erro ao listar categorias ativas.');
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
      this.notificationService.exibirErro(`Erro ao buscar categoria ${id}.`);
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
        this.notificationService.exibirErro('Erro ao inserir categoria.');
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
        this.notificationService.exibirErro('Erro ao atualizar categoria.');
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
        this.notificationService.exibirErro('Erro ao remover categoria.');
        throw error;
      })
    );
  }

  getReceitasCategoria(page: number, size: number) {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get(
      `${API_URL}/relatorios/receitas-categoria`,
      {
        ...defaultHttpOptions,
        params
      }
    );
  }

baixarRelatorioPdf() {
  return this.http.get(
    `${API_URL}/relatorios/receitas-categoria/pdf`,
    {
      headers: defaultHttpOptions.headers,
      responseType: 'blob'
    }
  );
}
}
