import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let mensagemErro = 'Ocorreu um erro desconhecido!';

      if (error.error instanceof ErrorEvent) {
        mensagemErro = `Erro: ${error.error.message}`;
      } else {
        const mensagemBackend: string | undefined = error.error?.mensagem;

        switch (error.status) {
          case 400:
            mensagemErro = mensagemBackend || 'Dados inválidos enviados na requisição.';
            break;
          case 401:
            if (req.url.includes('/api/auth/login')) {
              mensagemErro = mensagemBackend || 'Credenciais inválidas.';
            } else {
              mensagemErro = 'Sessão expirada ou não autorizada. Faça login novamente.';
              authService.efetuarLogout();
            }
            break;
          case 403:
            mensagemErro = mensagemBackend || 'Você não tem permissão para acessar este recurso.';
            break;
          case 404:
            mensagemErro = mensagemBackend || 'Recurso não encontrado.';
            break;
          case 409:
            mensagemErro = mensagemBackend || 'Já existe um registro com esses dados.';
            break;
          case 422:
            mensagemErro = mensagemBackend || 'Operação não permitida pela regra de negócio.';
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
