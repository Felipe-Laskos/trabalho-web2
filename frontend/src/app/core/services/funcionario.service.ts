import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Funcionario } from '../models/funcionario.model';
import { IFuncionarioService } from '../interfaces/funcionario.service.interface';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/internal/operators/catchError';
import { map } from 'rxjs/internal/operators/map';
import { API_URL, defaultHttpOptions } from '../config/http.config';
import { NotificationService } from './notification.service';
import { Page } from '../dto/response/page.dto';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService implements IFuncionarioService {
  private apiUrl = `${API_URL}/funcionarios`;

  constructor(private http: HttpClient, private notificationService: NotificationService) {}

  listarTodos(page: number, size: number): Observable<Page<Funcionario>> {

    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', 'nome,asc');

    return this.http.get<Page<Funcionario>>(
      this.apiUrl,
      {
        params,
        ...defaultHttpOptions
      }).pipe(
      catchError(error => {
        this.notificationService.exibirErro(
          'Erro ao listar funcionários.'
        );
        throw error;
      })
    );
  }

  buscarPorId(id: number): Observable<Funcionario> {
  return this.http.get<Funcionario>(
    `${this.apiUrl}/${id}`,
    defaultHttpOptions
  ).pipe(
    catchError(error => {
      this.notificationService.exibirErro(`Erro ao buscar funcionário com ID ${id}.`);
      throw error;
    })
  );
}

  buscarPorEmail(email: string): Observable<Funcionario> {
    return this.http.get<Funcionario>(
      `${this.apiUrl}/email/${email}`,
      defaultHttpOptions
    ).pipe(
      catchError(error => {
        this.notificationService.exibirErro(`Erro ao buscar funcionário com email ${email}.`);
        throw error;
      })
    );
  }

  buscarPorCpf(cpf: string): Observable<Funcionario> {
    const cpfLimpo = cpf.replace(/\D/g, '');
    return this.http.get<Funcionario>(
      `${this.apiUrl}/cpf/${cpfLimpo}`,
      defaultHttpOptions
    ).pipe(
      catchError(error => {
        this.notificationService.exibirErro(`Erro ao buscar funcionário com CPF ${cpfLimpo}.`);
        throw error;
      })
    );
  }
    
  inserir(funcionario: Funcionario): Observable<Funcionario> {
    return this.http.post<Funcionario>(
      this.apiUrl,
      funcionario,
      defaultHttpOptions    
    ).pipe(
      map(response => {
        this.notificationService.exibirSucesso('Funcionário inserido com sucesso!');
        return response;
      })
    );
  }

  atualizar(funcionario: Funcionario): Observable<Funcionario> {
    return this.http.patch<Funcionario>(
      `${this.apiUrl}/${funcionario.id}`,
      funcionario,
      defaultHttpOptions
    ).pipe(
      map(response => {
        this.notificationService.exibirSucesso('Funcionário atualizado com sucesso!');
        return response;
      }),
      catchError(error => {
        this.notificationService.exibirErro('Erro ao atualizar funcionário.');
        throw error;
      })
    );
  }

  listarAtivos(page:number, size:number): Observable<Page<Funcionario>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<Page<Funcionario>>(
      `${this.apiUrl}/ativos`,
      { params }
    ).pipe(
      catchError(error => {
        this.notificationService.exibirErro('Erro ao listar funcionários ativos.');
        throw error;
      })
    );
  } 

  listarInativos(page:number, size:number): Observable<Page<Funcionario>> {
  const params = new HttpParams()
    .set('page', page)
    .set('size', size);

  return this.http.get<Page<Funcionario>>(
    `${this.apiUrl}/inativos`,
    { params }
  ).pipe(
    catchError(error => {
      this.notificationService.exibirErro('Erro ao listar funcionários inativos.');
      throw error;
    })
  );
}

  remover(id: number): Observable<Funcionario> {
    return this.http.delete<Funcionario>(
        `${this.apiUrl}/${id}`,
        defaultHttpOptions
    ).pipe(
        catchError(error => {
            this.notificationService.exibirErro('Erro ao remover funcionário.');
            throw error;
        })
    );
  }

  reativar(id:number): Observable<Funcionario>{
    return this.http.patch<Funcionario>(
      `${this.apiUrl}/${id}/reativar`,
      {},
      defaultHttpOptions
    ).pipe(
      catchError(error=>{
        this.notificationService.exibirErro(error);
        throw error;
      })
    );
  }
}
