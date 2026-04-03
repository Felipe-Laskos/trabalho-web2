import { Cliente } from './cliente.model';
import { Funcionario } from './funcionario.model';
import { CategoriaEquipamento } from './categoria.model';
import { HistoricoSolicitacao } from './historico.model';

export interface Solicitacao {
  id?: number;

  descricaoEquipamento: string;
  descricaoDefeito: string;

  estadoAtual: string;

  valorOrcado?: number;
  funcionarioOrcamento?: string; 
  dataHoraOrcamento?: string;   

  motivoRejeicao?: string;
  descricaoManutencao?: string;
  orientacoesCliente?: string;

  dataHoraCriacao: string;
  dataHoraPagamento?: string;
  dataHoraFinalizacao?: string;

  ativo?: boolean;

  cliente?: Cliente;
  categoria?: CategoriaEquipamento;
  funcionarioResponsavel?: Funcionario;

  historico?: HistoricoSolicitacao[];
}