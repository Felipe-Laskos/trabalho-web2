import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ClienteService } from './cliente.service';
import { FuncionarioService } from './funcionario.service';
import { IAuthService } from '../interfaces/auth.service.interface';

const LS_USUARIO = "usuarioSessao";
const LS_PERFIL = "usuarioPerfil";
const LS_EMAIL = "usuarioEmail";

@Injectable({
  providedIn: 'root'
})
export class AuthService implements IAuthService {

  private clienteService = inject(ClienteService);
  private funcionarioService = inject(FuncionarioService);
  private router = inject(Router);
  private http = inject(HttpClient);

  validarLogin(email: string, senha: string): { sucesso: boolean, mensagem: string } {
    const cliente = this.clienteService.buscarPorEmail(email);
    const funcionario = this.funcionarioService.buscarPorEmail(email);

    if (cliente) {
      if (cliente.ativo === false) return { sucesso: false, mensagem: 'Usuário desativado.' };
      if (cliente.senha === senha) {
        this.salvarSessao(cliente.nome, email, 'cliente');
        return { sucesso: true, mensagem: '' };
      }
      return { sucesso: false, mensagem: 'Senha incorreta.' };
    }

    if (funcionario) {
      if (funcionario.ativo === false) return { sucesso: false, mensagem: 'Usuário desativado.' };
      if (funcionario.senha === senha) {
        this.salvarSessao(funcionario.nome, email, 'funcionario');
        return { sucesso: true, mensagem: '' };
      }
      return { sucesso: false, mensagem: 'Senha incorreta.' };
    }

    return { sucesso: false, mensagem: 'E-mail não encontrado.' };
  }

  salvarSessao(nome: string, email: string, perfil: 'cliente' | 'funcionario'): void {
    localStorage.setItem(LS_USUARIO, nome);
    localStorage.setItem(LS_PERFIL, perfil);
    localStorage.setItem(LS_EMAIL, email);
  }

  efetuarLogout(): void {
    localStorage.removeItem(LS_USUARIO);
    localStorage.removeItem(LS_PERFIL);
    localStorage.removeItem(LS_EMAIL);
    this.router.navigate(['/login']);
  }

  estaLogado(): boolean {
    return !!localStorage.getItem(LS_USUARIO);
  }

  getNome(): string {
    return localStorage.getItem(LS_USUARIO) || '';
  }

  getEmail(): string {
    return localStorage.getItem(LS_EMAIL) || '';
  }

  getPerfil(): 'cliente' | 'funcionario' | null {
    const perfil = localStorage.getItem(LS_PERFIL);
    if (perfil === 'cliente' || perfil === 'funcionario') return perfil;
    return null;
  }

  isCliente(): boolean {
    return this.getPerfil() === 'cliente';
  }

  isFuncionario(): boolean {
    return this.getPerfil() === 'funcionario';
  }
}