import { HistoricoSolicitacao } from '../models/historico.model';
import { mockFuncionario } from './funcionario.mock';

export const mockHistoricoSolicitacao: HistoricoSolicitacao[] = [

  {
    id: 11,
    solicitacaoId: 1000,
    estadoAnterior: "ABERTA",
    estadoNovo: "ORCADA",
    dataHora: "2024-01-02 10:00",
    funcionario: mockFuncionario[0],
    observacao: "Orçamento realizado pelo técnico. Valor estimado: R$ 350,00.",
  },

  {
    id: 12,
    solicitacaoId: 1003,
    estadoAnterior: "APROVADA",
    estadoNovo: "REDIRECIONADA",
    dataHora: "2024-01-05 14:30",
    funcionario: mockFuncionario[0],
    funcionarioDestino: mockFuncionario[1],
    observacao: "Redirecionado para técnico especialista.",
  },

  {
    id: 13,
    solicitacaoId: 1004,
    estadoAnterior: "APROVADA",
    estadoNovo: "ARRUMADA",
    dataHora: "2024-01-06 16:00",
    funcionario: mockFuncionario[0],
    observacao: "Manutenção concluída com sucesso.",
  },

  {
    id: 14,
    solicitacaoId: 1005,
    estadoAnterior: "ARRUMADA",
    estadoNovo: "PAGA",
    dataHora: "2024-01-07 09:00",
    funcionario: mockFuncionario[0],
    observacao: "Pagamento confirmado pelo cliente.",
  },

  {
    id: 15,
    solicitacaoId: 1016,
    estadoAnterior: "APROVADA",
    estadoNovo: "REDIRECIONADA",
    dataHora: "2024-01-18 11:00",
    funcionario: mockFuncionario[1],
    funcionarioDestino: mockFuncionario[0],
    observacao: "Redirecionado para outro técnico.",
  },

  {
    id: 16,
    solicitacaoId: 1006,
    estadoAnterior: "ORCADA",
    estadoNovo: "REJEITADA",
    dataHora: "2024-01-08 10:00",
    funcionario: mockFuncionario[1],
    observacao: "Cliente rejeitou o orçamento. Motivo: Display muito caro.",
  }
];
