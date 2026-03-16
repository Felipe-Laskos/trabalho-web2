import { HistoricoSolicitacao } from '../models/historico.model';
import { mockFuncionario } from './funcionario.mock';

export const mockHistoricoSolicitacao: HistoricoSolicitacao[] = [

  {
    id: 11,
    solicitacaoId: 1000,
    estadoAnterior: "ABERTA",
    estadoNovo: "ORCADA",
    dataHora: "2026-03-01 18:00",
    funcionario: mockFuncionario [0],
    funcionarioDestino: mockFuncionario [1],
    observacao: "Orçamento realizado pelo técnico João. Valor estimado: R$ 500,00.",
  }
];

