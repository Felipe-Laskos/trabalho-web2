import { EnderecoRequest } from './endereco-request.model';

export interface ClienteRequest {
  cpf: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: EnderecoRequest;
}
