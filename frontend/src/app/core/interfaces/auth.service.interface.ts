import { Observable } from 'rxjs';
import { LoginRequest } from '../dto/request/login-request.model';
import { LoginResponse } from '../dto/response/login-response.model';
import { PerfilENUM } from '../models/perfilENUM.model';

export interface IAuthService {
  login(credenciais: LoginRequest): Observable<LoginResponse>;
  efetuarLogout(): void;
  estaLogado(): boolean;
  getToken(): string | null;
  getNome(): string;
  getEmail(): string;
  getPerfil(): PerfilENUM | null;
  isCliente(): boolean;
  isFuncionario(): boolean;
}
