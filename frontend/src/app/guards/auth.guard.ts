import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.estaLogado()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

export const clienteGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.estaLogado() && authService.isCliente()) {
    return true;
  }

  if (authService.estaLogado()) {
    router.navigate(['/funcionario']);
  } else {
    router.navigate(['/login']);
  }
  return false;
};

export const funcionarioGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.estaLogado() && authService.isFuncionario()) {
    return true;
  }

  if (authService.estaLogado()) {
    router.navigate(['/cliente']);
  } else {
    router.navigate(['/login']);
  }
  return false;
};
