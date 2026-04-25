import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

const ROTAS_PUBLICAS = [
  { metodo: 'POST', urlContem: '/api/auth/login' },
  { metodo: 'POST', urlContem: '/api/clientes' }
];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const ehPublica = ROTAS_PUBLICAS.some(
    (rota) => req.method === rota.metodo && req.url.includes(rota.urlContem)
  );

  if (ehPublica) {
    return next(req);
  }

  const token = authService.getToken();
  if (!token) {
    return next(req);
  }

  const reqAutenticada = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });
  return next(reqAutenticada);
};
