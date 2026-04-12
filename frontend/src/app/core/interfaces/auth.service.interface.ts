export abstract class IAuthService {
  abstract validarLogin(email: string, senha: string): { sucesso: boolean, mensagem: string };
  abstract salvarSessao(nome: string, email: string, perfil: 'cliente' | 'funcionario'): void;
  abstract efetuarLogout(): void;
  abstract estaLogado(): boolean;
  abstract getNome(): string;
  abstract getEmail(): string;
  abstract getPerfil(): 'cliente' | 'funcionario' | null;
  abstract isCliente(): boolean;
  abstract isFuncionario(): boolean;
}