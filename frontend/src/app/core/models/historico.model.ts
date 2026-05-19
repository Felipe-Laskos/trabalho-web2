export interface HistoricoSolicitacao {
  id?: number;

  dataHora: string;

  estadoAnterior?: string;
  estadoNovo: string;

  observacao?: string;

  solicitacaoId: number;

  funcionario?: string;
  funcionarioDestino?: string;
}
