import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private notificationService: NotificationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400 && error.error && error.error.fieldErrors) {
          return throwError(() => error);
        }
        let mensagemErro = 'Ocorreu um erro inesperado no servidor.';

        if (error.error && error.error.mensagem) {
          mensagemErro = error.error.mensagem;
        } else if (error.status === 401) {
          mensagemErro = 'Sessão expirada ou não autorizada. Faça login novamente.';
        } else if (error.status === 403) {
          mensagemErro = 'Você não tem permissão para realizar esta ação.';
        } else if (error.status === 404) {
          mensagemErro = 'Recurso não encontrado.';
        } else if (error.status === 422) {
          mensagemErro = error.error.mensagem || 'Erro de regra de negócio.';
        } else if (error.status === 0) {
          mensagemErro = 'Falha na conexão. Verifique se o servidor está rodando.';
        }

        this.notificationService.exibirErro(mensagemErro);

        return throwError(() => error);
      })
    );
  }
}