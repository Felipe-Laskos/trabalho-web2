package com.web.equipe5.manutencaoequipamentos.config;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.web.equipe5.manutencaoequipamentos.enums.EstadoSolicitacao;
import com.web.equipe5.manutencaoequipamentos.model.*;
import com.web.equipe5.manutencaoequipamentos.repository.*;
import com.web.equipe5.manutencaoequipamentos.service.HashService;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ClienteRepository clienteRepository;
    private final FuncionarioRepository funcRepository;
    private final CategoriaRepository categoriaRepository;
    private final SolicitacaoRepository solicitacaoRepository;
    private final HashService hashService;

    public DataSeeder(
            ClienteRepository clienteRepository,
            FuncionarioRepository funcRepository,
            CategoriaRepository categoriaRepository,
            SolicitacaoRepository solicitacaoRepository,
            HashService hashService) {
        this.clienteRepository = clienteRepository;
        this.funcRepository = funcRepository;
        this.categoriaRepository = categoriaRepository;
        this.solicitacaoRepository = solicitacaoRepository;
        this.hashService = hashService;
    }

    @Override
    public void run(String... args) {
        if (clienteRepository.count() > 0) return;

        seedFuncionarios();
        seedClientes();
        seedCategorias();
        seedSolicitacoes();
    }

    private void seedFuncionarios() {
    Funcionario f1 = new Funcionario();
    f1.setNome("Maria Silva Pereira");
    f1.setCpf("12345678900");
    f1.setEmail("maria@empresa.com");
    f1.setCargo("Técnica de Suporte");
    f1.setDataNascimento(LocalDate.of(1998, 11, 12));
    f1.setAtivo(true);

    salvarFuncionario(f1, "123456");

    Funcionario f2 = new Funcionario();
    f2.setNome("Mário da Rocha Bastos");
    f2.setCpf("98765432100");
    f2.setEmail("mario@empresa.com");
    f2.setCargo("Analista de Sistemas");
    f2.setDataNascimento(LocalDate.of(1980, 5, 20));
    f2.setAtivo(true);

    salvarFuncionario(f2, "123456");
}

private void seedClientes() {
    Cliente c1 = new Cliente();
    c1.setNome("João");
    c1.setEmail("joao@gmail.com");
    c1.setCpf("12345678900");
    c1.setTelefone("4199999999");
    c1.setAtivo(true);
    c1.setDataCadastro(LocalDateTime.of(2024, 1, 1, 0, 0));

    salvarCliente(c1, "1111");

    Cliente c2 = new Cliente();
    c2.setNome("José");
    c2.setEmail("jose@gmail.com");
    c2.setCpf("11122233344");
    c2.setTelefone("4199999998");
    c2.setAtivo(true);
    c2.setDataCadastro(LocalDateTime.of(2024, 2, 15, 0, 0));

    salvarCliente(c2, "2222");

    Cliente c3 = new Cliente();
    c3.setNome("Joana");
    c3.setEmail("joana@gmail.com");
    c3.setCpf("12345678910");
    c3.setTelefone("4199999997");
    c3.setAtivo(true);
    c3.setDataCadastro(LocalDateTime.of(2024, 3, 10, 0, 0));

    salvarCliente(c3, "3333");

    Cliente c4 = new Cliente();
    c4.setNome("Joaquina");
    c4.setEmail("joaquina@gmail.com");
    c4.setCpf("12345678911");
    c4.setTelefone("4199999996");
    c4.setAtivo(true);
    c4.setDataCadastro(LocalDateTime.of(2024, 4, 20, 0, 0));

    salvarCliente(c4, "4444");
}

private void seedCategorias() {
    List<CategoriaEquipamento> categorias = List.of(
        new CategoriaEquipamento(null, "Notebook", true),
        new CategoriaEquipamento(null, "Desktop", true),
        new CategoriaEquipamento(null, "Teclado", true),
        new CategoriaEquipamento(null, "Mouse", true),
        new CategoriaEquipamento(null, "Impressora", true)
    );

    categoriaRepository.saveAll(categorias);
}

private void seedSolicitacoes() {

    var clientes = clienteRepository.findAll();
    var categorias = categoriaRepository.findAll();
    var funcionarios = funcRepository.findAll();

    solicitacaoRepository.saveAll(List.of(

        // ABERTA
        criarSolicitacao("Mouse Logitech", "Não funciona", EstadoSolicitacao.ABERTA, null, clientes.get(0), categorias.get(3), null),

        // ORCADA
        criarSolicitacao("Notebook Dell", "Tela queimada", EstadoSolicitacao.ORCADA, 350.0, clientes.get(0), categorias.get(0), funcionarios.get(0)),

        // APROVADA
        criarSolicitacao("Tablet Lenovo", "Tela trincada", EstadoSolicitacao.APROVADA, 200.0, clientes.get(2), categorias.get(1), funcionarios.get(1)),

        // ARRUMADA
        criarSolicitacao("Monitor LG", "Imagem piscando", EstadoSolicitacao.ARRUMADA, 150.0, clientes.get(0), categorias.get(2), funcionarios.get(0)),

        // PAGA
        criarSolicitacao("Impressora HP", "Não imprime", EstadoSolicitacao.PAGA, 120.0, clientes.get(3), categorias.get(4), funcionarios.get(0)),

        // FINALIZADA
        criarSolicitacao("PlayStation 4", "Superaquecendo", EstadoSolicitacao.FINALIZADA, 220.0, clientes.get(3), categorias.get(1), funcionarios.get(1)),

        criarSolicitacao("Teclado Redragon", "Teclas falhando", EstadoSolicitacao.ORCADA, 140.0, clientes.get(2), categorias.get(3), funcionarios.get(0)),

        criarSolicitacao("Notebook Acer", "Bateria ruim", EstadoSolicitacao.APROVADA, 300.0, clientes.get(1), categorias.get(0), funcionarios.get(1)),

        criarSolicitacao("Mouse Gamer", "Clique falha", EstadoSolicitacao.PAGA, 80.0, clientes.get(1), categorias.get(3), funcionarios.get(1)),

        criarSolicitacao("Notebook HP", "HD queimado", EstadoSolicitacao.ARRUMADA, 400.0, clientes.get(1), categorias.get(0), funcionarios.get(0)),

        criarSolicitacao("Câmera Canon", "Não foca", EstadoSolicitacao.APROVADA, 500.0, clientes.get(0), categorias.get(2), funcionarios.get(1)),

        criarSolicitacao("Headset HyperX", "Microfone não funciona", EstadoSolicitacao.ABERTA, null, clientes.get(2), categorias.get(4), null),

        criarSolicitacao("Notebook Samsung", "Não liga", EstadoSolicitacao.ABERTA, null, clientes.get(0), categorias.get(0), null),

        criarSolicitacao("Monitor Dell", "Tela preta", EstadoSolicitacao.ORCADA, 200.0, clientes.get(1), categorias.get(2), funcionarios.get(0)),

        criarSolicitacao("Teclado Logitech", "Teclas presas", EstadoSolicitacao.APROVADA, 90.0, clientes.get(2), categorias.get(3), funcionarios.get(1)),

        criarSolicitacao("Mouse Multilaser", "Scroll quebrado", EstadoSolicitacao.ARRUMADA, 50.0, clientes.get(3), categorias.get(3), funcionarios.get(0)),

        criarSolicitacao("Impressora Epson", "Mancha tinta", EstadoSolicitacao.PAGA, 180.0, clientes.get(0), categorias.get(4), funcionarios.get(1)),

        criarSolicitacao("Notebook Lenovo", "Superaquecendo", EstadoSolicitacao.FINALIZADA, 350.0, clientes.get(2), categorias.get(0), funcionarios.get(0)),

        criarSolicitacao("Headset JBL", "Sem som", EstadoSolicitacao.APROVADA, 120.0, clientes.get(1), categorias.get(4), funcionarios.get(1)),

        criarSolicitacao("Monitor Samsung", "Linhas na tela", EstadoSolicitacao.ABERTA, null, clientes.get(3), categorias.get(2), null)
    ));
}



private Solicitacao criarSolicitacao(String eq, String defeito,
    EstadoSolicitacao estado, Double valor,
    Cliente cliente, CategoriaEquipamento categoria,
    Funcionario funcionario) {

    Solicitacao s = new Solicitacao();

    s.setDescricaoEquipamento(eq);
    s.setDescricaoDefeito(defeito);
    s.setEstadoAtual(estado);
    s.setValorOrcado(valor);
    s.setCliente(cliente);
    s.setCategoriaEquipamento(categoria);
    s.setFuncionarioResponsavel(funcionario);
    s.setAtivo(true);
    s.setDataHoraCriacao(LocalDateTime.now());

    return s;
}


private void salvarFuncionario(Funcionario f, String senha) {
    String salt = hashService.gerarSaltHex();
    String hash = hashService.sha256Hex(senha, salt);

    f.setSenha(hash);
    f.setSalt(salt);

    funcRepository.save(f);
}

private void salvarCliente(Cliente c, String senha) {
    String salt = hashService.gerarSaltHex();
    String hash = hashService.sha256Hex(senha, salt);

    c.setSenha(hash);
    c.setSalt(salt);

    clienteRepository.save(c);
}
}