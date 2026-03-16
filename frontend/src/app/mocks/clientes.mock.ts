import { Cliente } from '../models/cliente.model';

export const mockCliente: Cliente[] = [
  {
    id: 10,
    nome: "João",
    email: "joao@gmail.com",
    telefone: "4199999999",
    cpf: "123.456.789-00",
    ativo: true,
    dataCadastro: "2024-01-01",
    endereco: {
      id: 11,
      cep: "80000-000",
      logradouro: "Rua das graças",
      bairro: "Iguaçu",
      cidade: "Curitiba",
      uf: "PR",
      complemento: "Apartamento 101",
      numero: "222"
    },
  },

  {
    id: 20,
    nome: "José",
    email: "jose22@gmail.com",
    telefone: "4199999998",
    cpf: "111.222.333-44",
    ativo: false,
    dataCadastro: "2024-02-15",
    endereco: {
      id: 12,
      cep: "80000-111",
      logradouro: "Rua das ruelas",
      bairro: "Batel",
      cidade: "Curitiba",
      uf: "PR",
      complemento: "Casa 35",
      numero: "335"
    },
  },

  {
    id: 30,
    nome: "Joana",
    email: "joanaa2@gmail.com",
    telefone: "4199999997",
    cpf: "123.456.789-10",
    ativo: true,
    dataCadastro: "2024-03-10",
    endereco: {
      id: 13,
      cep: "80000-222",
      logradouro: "Rua das avenidas",
      bairro: "São Francisco",
      cidade: "Curitiba",
      uf: "PR",
      complemento: "Casa 28",
      numero: "373"
    },
  },

  {
    id: 40,
    nome: "Joaquina",
    email: "jojoaquina@gmail.com",
    telefone: "4199999996",
    cpf: "123.456.789-11",
    ativo: false,
    dataCadastro: "2024-04-20",
    endereco: {
      id: 14,
      cep: "83708-258",
      logradouro: "Rua das ruas",
      bairro: "Jardim Botânico",
      cidade: "Curitiba",
      uf: "PR",
      complemento: "apartamento 34",
      numero: "444"
    },
  }
];