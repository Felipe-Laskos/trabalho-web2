import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { IAuthService } from '../interfaces/auth.service.interface';
import { LoginRequest } from '../dto/request/login-request.model';
import { LoginResponse } from '../dto/response/login-response.model';
import { PerfilENUM } from '../models/perfilENUM.model';
import { API_URL, defaultHttpOptions } from '../config/http.config';

const LS_TOKEN = 'authToken';
const LS_USUARIO = 'usuarioSessao';
const LS_PERFIL = 'usuarioPerfil';
const LS_EMAIL = 'usuarioEmail';
const LS_USER_ID = 'usuarioId';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements IAuthService {

  private http = inject(HttpClient);
  private router = inject(Router);

  login(credenciais: LoginRequest): Observable<HttpResponse<LoginResponse>> {
    return this.http
      .post<LoginResponse>(`${API_URL}/auth/login`, credenciais, defaultHttpOptions)
      .pipe(
        tap((res) => {
          if (res.body) {
            this.salvarSessao(res.body);
          }
        })
      );
  }

  private salvarSessao(dados: LoginResponse): void {
    localStorage.setItem(LS_TOKEN, dados.token);
    localStorage.setItem(LS_USUARIO, dados.nome);
    localStorage.setItem(LS_EMAIL, dados.email);
    localStorage.setItem(LS_PERFIL, (dados.perfil ?? '').toUpperCase());
    localStorage.setItem(LS_USER_ID, String(dados.id));
  }

  efetuarLogout(): void {
    localStorage.removeItem(LS_TOKEN);
    localStorage.removeItem(LS_USUARIO);
    localStorage.removeItem(LS_PERFIL);
    localStorage.removeItem(LS_EMAIL);
    localStorage.removeItem(LS_USER_ID);
    this.router.navigate(['/login']);
  }

  estaLogado(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(LS_TOKEN);
  }

  getNome(): string {
    return localStorage.getItem(LS_USUARIO) || '';
  }

  getEmail(): string {
    return localStorage.getItem(LS_EMAIL) || '';
  }

  getPerfil(): PerfilENUM | null {
    const perfil = (localStorage.getItem(LS_PERFIL) ?? '').toUpperCase();
    if (perfil === PerfilENUM.CLIENTE || perfil === PerfilENUM.FUNCIONARIO) {
      return perfil as PerfilENUM;
    }
    return null;
  }

  isCliente(): boolean {
    return this.getPerfil() === PerfilENUM.CLIENTE;
  }

  isFuncionario(): boolean {
    return this.getPerfil() === PerfilENUM.FUNCIONARIO;
  }
}
