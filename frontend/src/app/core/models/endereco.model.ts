export interface Endereco {
  id?: number;

  cep: string;
  logradouro: string;

  bairro: string;
  cidade: string;
  uf: string;

  complemento?: string;
  numero: string;
}