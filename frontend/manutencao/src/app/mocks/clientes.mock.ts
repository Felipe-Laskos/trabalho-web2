import { Cliente } from '../shared/models/cliente.model';

export const mockCliente: Cliente[] = [
    {
      id: 10,
      nome: "João",
      email: "joao@gmail.com",
       telefone: "4199999999",
       cpf: "123.456.789-00",
       endereco: {
        rua: "Rua das Flores",
        numero: 111,
        cidade: "Curitiba",
        estado: "PR",
        cep: "80000-000"
      },
      dataNascimento: "1970-03-06",
      senha: 1234
   },
    {
      id: 20,
      nome: "José",
      email: "jose22@gmail.com",
      telefone: "4199999998",
       cpf: "111.222.333-44",
       endereco: {
        rua: "Rua das graças",
        numero: 222,
        cidade: "Curitiba",
        estado: "PR",
        cep: "80000-111"
      },
      dataNascimento: "1981-09-20",
      senha: 123455
  },
   {
      id: 30,
      nome: "Joana",
      email: "joanaa2@gmail.com",
      telefone: "4199999997",
       cpf: "123.456.789-10",
       endereco: {
        rua: "Rua das ruelas",
        numero: 333,
        cidade: "Curitiba",
        estado: "PR",
        cep: "80000-222"
      },
      dataNascimento: "2003-05-24",
      senha: 1222
  },
   {
      id: 40,
      nome: "Joaquina",
      email: "jojoaquina@gmail.com",
      telefone: "4199999996",
       cpf: "123.456.789-11",
       endereco: {
        rua: "Rua das ruas",
        numero: 444,
        cidade: "Curitiba",
        estado: "PR",
        cep: "80000-333"
      },
      dataNascimento: "1999-08-14",
      senha: 1478
  }
];