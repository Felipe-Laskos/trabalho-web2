import { Funcionario } from '../models/funcionario.model';

export const mockFuncionario: Funcionario[] = [
    {
      id: 1,
      nome: "Maria Silva Pereira",
      cpf: "123.456.789-00",
      email: "maria@empresa.com",
      senha: "123456",
      dataNascimento: "1998-11-12",
      cargo: "Técnica de Suporte",
      ativo: true
   },
    {
      id: 2,
      nome: "Mário da Rocha Bastos",
      cpf: "987.654.321-00",
      email: "mario@empresa.com",
      senha: "123456",
      dataNascimento: "1980-05-20",
      cargo: "Analista de Sistemas",
      ativo: true
  },

  {
    id: 3,
    nome: "João Carlos Oliveira",
    cpf: "456.789.123-00",
    email: "joao@empresa.com",
    senha: "123456",
    dataNascimento: "1990-03-15",
    cargo: "Atendente",
    ativo: true
  },

  {
    id: 4,
    nome: "Ana Paula Souza",
    cpf: "321.654.987-00",
    email: "ana@empresa.com",
    senha: "123456",
    dataNascimento: "1985-07-22",
    cargo: "Técnico de Suporte",
    ativo: false
  }


];