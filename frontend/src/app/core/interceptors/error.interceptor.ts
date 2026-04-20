import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let mensagemErro = 'Ocorreu um erro desconhecido!';

      if (error.error instanceof ErrorEvent) {
        // Erro no lado do cliente
        mensagemErro = `Erro: ${error.error.message}`;
      } else {
        // Erro retornado pelo Backend
        switch (error.status) {
          case 401:
            mensagemErro = 'Sessão expirada ou não autorizada. Faça login novamente.';
            break;
          case 403:
            mensagemErro = 'Você não tem permissão para acessar este recurso.';
            break;
          case 404:
            mensagemErro = 'Recurso não encontrado.';
            break;
          case 400:
            mensagemErro = error.error?.message || 'Dados inválidos enviados na requisição.';
            break;
          case 500:
            mensagemErro = 'Erro interno no servidor. Tente novamente mais tarde.';
            break;
        }
      }

      // TODO: Futuramente implementar a Semana 10 do roadmap para integrar com serviço de Snackbar/Toast do Angular Material aqui
      console.error('Interceptor capturou:', mensagemErro);
      return throwError(() => new Error(mensagemErro));
    })
  );
};