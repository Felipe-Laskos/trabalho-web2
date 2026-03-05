export interface Cliente {
  id?: number;
  cpf: string;
  nome: string;
  email: string;
  telefone: string;
  endereco?: Endereco;
}

export interface Endereco {
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
  complemento?: string;
}

export interface Funcionario {
  id?: number;
  nome: string;
  email: string;
  dataNascimento: string;
}

export interface CategoriaEquipamento {
  id?: number;
  nome: string;
  ativa: boolean;
}

export interface Solicitacao {
  id?: number;
  data: string;
  descricaoEquipamento: string;
  descricaoDefeito: string;
  estado: EstadoSolicitacao;
  cliente?: Cliente;
  funcionario?: Funcionario;
  categoria?: CategoriaEquipamento;
  valorOrcamento?: number;
  descricaoManutencao?: string;
  orientacoesCliente?: string;
  motivoRejeicao?: string;
  historico?: HistoricoSolicitacao[];
}

export interface HistoricoSolicitacao {
  id?: number;
  dataHora: string;
  estadoAnterior: EstadoSolicitacao;
  estadoNovo: EstadoSolicitacao;
  funcionario?: Funcionario;
}

export type EstadoSolicitacao =
  | 'ABERTA'
  | 'ORCADA'
  | 'APROVADA'
  | 'REJEITADA'
  | 'REDIRECIONADA'
  | 'ARRUMADA'
  | 'PAGA'
  | 'FINALIZADA';
