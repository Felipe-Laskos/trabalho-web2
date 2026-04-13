import { Funcionario } from './funcionario.model';

export interface HistoricoSolicitacao {
  id?: number;

  dataHora: string;

  estadoAnterior?: string;
  estadoNovo: string;

  observacao?: string;

  solicitacaoId: number;

  funcionario?: Funcionario;
  funcionarioDestino?: Funcionario;
}