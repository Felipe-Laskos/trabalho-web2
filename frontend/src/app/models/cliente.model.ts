import { Endereco } from './endereco.model';

export interface Cliente {
  id?: number;
  cpf: string;
  nome: string;
  email: string;
  senha?: string;
  telefone: string;
  ativo?: boolean;
  dataCadastro?: string;

  endereco?: Endereco;
}
