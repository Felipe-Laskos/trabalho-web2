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

  listarTodos(page: number, size: number, termo?: string): Observable<Page<CategoriaEquipamento>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', 'nome,asc');

    if (termo?.trim()) {
      params = params.set('termo', termo.trim());
    }

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

  listarAtivas(page: number, size: number, termo?: string): Observable<Page<CategoriaEquipamento>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', 'nome,asc');

    if (termo?.trim()) {
      params = params.set('termo', termo.trim());
    }

    return this.http.get<Page<CategoriaEquipamento>>(
      `${this.apiUrl}/ativas`,
      {
        ...defaultHttpOptions,
        params
      }
    ).pipe(
      catchError(error => {
        this.notificationService.exibirErro('Erro ao listar categorias ativas.');
        throw error;
      })
    );
  }

  listarInativas(page: number, size: number, termo?: string): Observable<Page<CategoriaEquipamento>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', 'nome,asc');

    if (termo?.trim()) {
      params = params.set('termo', termo.trim());
    }

    return this.http.get<Page<CategoriaEquipamento>>(
      `${this.apiUrl}/inativas`,
      {
        ...defaultHttpOptions,
        params
      }
    ).pipe(
      catchError(error => {
        this.notificationService.exibirErro('Erro ao listar categorias inativas.');
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
    )
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

  getReceitasCategoria(page: number, size: number, categoria?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (categoria && categoria.trim() !== '') {
      params = params.set('categoria', categoria);
    }

    return this.http.get(
      `${API_URL}/relatorios/receitas-categoria`,
      {
        ...defaultHttpOptions,
        params
      }
    );
  }

  baixarRelatorioPdf(categoria?: string): Observable<Blob> {
    let params = new HttpParams();
    
    if (categoria && categoria.trim() !== '') {
      params = params.set('categoria', categoria.trim());
    }
    
    return this.http.get(`${API_URL}/relatorios/receitas-categoria/pdf`, {
      params: params, 
      responseType: 'blob' 
    });
  }

  reativar(id: number): Observable<CategoriaEquipamento> {
    return this.http.patch<CategoriaEquipamento>(
      `${this.apiUrl}/${id}/reativar`,
      {},
      defaultHttpOptions
    ).pipe(
      catchError(error => {
        this.notificationService.exibirErro(error);
        throw error;
      })
    );
  }
}
