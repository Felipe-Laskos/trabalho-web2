export interface IAuthService {
  validarLogin(email: string, senha: string): { sucesso: boolean, mensagem: string };
  salvarSessao(nome: string, email: string, perfil: 'cliente' | 'funcionario'): void;
  efetuarLogout(): void;
  estaLogado(): boolean;
  getNome(): string;
  getEmail(): string;
  getPerfil(): 'cliente' | 'funcionario' | null;
  isCliente(): boolean;
  isFuncionario(): boolean;
}