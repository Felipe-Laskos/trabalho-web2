import { PerfilENUM } from '../../models/perfilENUM.model';

export interface LoginResponse {
  token: string;
  expiresInMs: number;
  id: number;
  nome: string;
  email: string;
  perfil: PerfilENUM;
}
