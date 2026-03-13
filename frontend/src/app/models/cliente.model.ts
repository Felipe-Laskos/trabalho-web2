import { Endereco } from './endereco.model';

export interface Cliente {
  id?: number;
  cpf: string;
  nome: string;
  email: string;
  telefone: string;
  ativo?: boolean;
  dataCadastro?: string;

  endereco?: Endereco;
}
