import { EnderecoResponse } from './endereco-response.model';

export interface ClienteResponse {
  id: number;
  cpf: string;
  nome: string;
  email: string;
  telefone: string;
  ativo: boolean;
  endereco: EnderecoResponse;
}
