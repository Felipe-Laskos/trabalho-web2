package com.web.equipe5.manutencaoequipamentos.config;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
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
    private final HistoricoRepository historicoRepository;
    private final HashService hashService;

    public DataSeeder(
            ClienteRepository clienteRepository,
            FuncionarioRepository funcRepository,
            CategoriaRepository categoriaRepository,
            SolicitacaoRepository solicitacaoRepository,
            HistoricoRepository historicoRepository,
            HashService hashService) {
        this.clienteRepository = clienteRepository;
        this.funcRepository = funcRepository;
        this.categoriaRepository = categoriaRepository;
        this.solicitacaoRepository = solicitacaoRepository;
        this.historicoRepository = historicoRepository;
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

    List<String> equipamentos = List.of(
        "Mouse Logitech", "Notebook Dell", "Tablet Lenovo", "Monitor LG",
        "Impressora HP", "PlayStation 4", "Teclado Redragon", "Notebook Acer",
        "Mouse Gamer", "Notebook HP", "Camera Canon", "Headset HyperX",
        "Notebook Samsung", "Monitor Dell", "Teclado Logitech", "Mouse Multilaser"
    );

    List<String> defeitos = List.of(
        "Nao funciona", "Tela queimada", "Tela trincada", "Imagem piscando",
        "Nao imprime", "Superaquecendo", "Teclas falhando", "Bateria ruim",
        "Clique falha", "HD queimado", "Nao foca", "Microfone nao funciona",
        "Nao liga", "Tela preta", "Teclas presas", "Scroll quebrado"
    );

    EstadoSolicitacao[] estados = EstadoSolicitacao.values();
    List<Solicitacao> solicitacoes = new ArrayList<>();

    for (int i = 0; i < 56; i++) {
        EstadoSolicitacao estado = estados[i % estados.length];
        Cliente cliente = clientes.get(i % clientes.size());
        CategoriaEquipamento categoria = categorias.get(i % categorias.size());
        Funcionario funcionario = estado == EstadoSolicitacao.ABERTA ? null : funcionarios.get(i % funcionarios.size());
        LocalDateTime dataCriacao = LocalDateTime.now()
            .minusDays((i * 7L) % 90)
            .withHour(8 + (i % 10))
            .withMinute((i * 11) % 60)
            .withSecond(0)
            .withNano(0);
        Double valor = estado == EstadoSolicitacao.ABERTA ? null : 80.0 + ((i % 12) * 45.0);

        solicitacoes.add(criarSolicitacao(
            equipamentos.get(i % equipamentos.size()) + " #" + (i + 1),
            defeitos.get(i % defeitos.size()),
            estado,
            valor,
            cliente,
            categoria,
            funcionario,
            dataCriacao
        ));
    }

    List<Solicitacao> salvas = solicitacaoRepository.saveAll(solicitacoes);
    List<HistoricoSolicitacao> historicos = new ArrayList<>();

    for (Solicitacao solicitacao : salvas) {
        historicos.addAll(criarHistorico(solicitacao));
    }

    historicoRepository.saveAll(historicos);
}



private Solicitacao criarSolicitacao(String eq, String defeito,
    EstadoSolicitacao estado, Double valor,
    Cliente cliente, CategoriaEquipamento categoria,
    Funcionario funcionario,
    LocalDateTime dataCriacao) {

    Solicitacao s = new Solicitacao();

    s.setDescricaoEquipamento(eq);
    s.setDescricaoDefeito(defeito);
    s.setEstadoAtual(estado);
    s.setValorOrcado(valor);
    s.setCliente(cliente);
    s.setCategoriaEquipamento(categoria);
    s.setFuncionarioResponsavel(funcionario);
    s.setAtivo(true);
    s.setDataHoraCriacao(dataCriacao);

    if (funcionario != null && valor != null) {
        s.setFuncionarioOrcamento(funcionario.getNome());
        s.setDataHoraOrcamento(dataCriacao.plusDays(1));
    }

    if (estado == EstadoSolicitacao.REJEITADA) {
        s.setMotivoRejeicao("Cliente rejeitou o orcamento inicial.");
    }

    if (estado == EstadoSolicitacao.ARRUMADA || estado == EstadoSolicitacao.PAGA || estado == EstadoSolicitacao.FINALIZADA) {
        s.setDescricaoManutencao("Manutencao executada conforme diagnostico.");
        s.setOrientacoesCliente("Retirar o equipamento e testar na entrega.");
        s.setDataHoraManutencao(dataCriacao.plusDays(3));
    }

    if (estado == EstadoSolicitacao.PAGA || estado == EstadoSolicitacao.FINALIZADA) {
        s.setDataHoraPagamento(dataCriacao.plusDays(4));
    }

    if (estado == EstadoSolicitacao.FINALIZADA) {
        s.setDataHoraFinalizacao(dataCriacao.plusDays(5));
    }

    return s;
}

private List<HistoricoSolicitacao> criarHistorico(Solicitacao solicitacao) {
    List<HistoricoSolicitacao> historicos = new ArrayList<>();
    Funcionario funcionario = solicitacao.getFuncionarioResponsavel();
    LocalDateTime data = solicitacao.getDataHoraCriacao();

    historicos.add(criarHistoricoItem(solicitacao, null, EstadoSolicitacao.ABERTA, null, data, "Solicitacao aberta pelo cliente."));

    switch (solicitacao.getEstadoAtual()) {
        case ABERTA -> { }
        case ORCADA -> historicos.add(criarHistoricoItem(solicitacao, EstadoSolicitacao.ABERTA, EstadoSolicitacao.ORCADA, funcionario, data.plusDays(1), "Orcamento registrado."));
        case REJEITADA -> {
            historicos.add(criarHistoricoItem(solicitacao, EstadoSolicitacao.ABERTA, EstadoSolicitacao.ORCADA, funcionario, data.plusDays(1), "Orcamento registrado."));
            historicos.add(criarHistoricoItem(solicitacao, EstadoSolicitacao.ORCADA, EstadoSolicitacao.REJEITADA, funcionario, data.plusDays(2), "Orcamento rejeitado pelo cliente."));
        }
        case APROVADA -> {
            historicos.add(criarHistoricoItem(solicitacao, EstadoSolicitacao.ABERTA, EstadoSolicitacao.ORCADA, funcionario, data.plusDays(1), "Orcamento registrado."));
            historicos.add(criarHistoricoItem(solicitacao, EstadoSolicitacao.ORCADA, EstadoSolicitacao.APROVADA, funcionario, data.plusDays(2), "Orcamento aprovado pelo cliente."));
        }
        case REDIRECIONADA -> {
            historicos.add(criarHistoricoItem(solicitacao, EstadoSolicitacao.ABERTA, EstadoSolicitacao.ORCADA, funcionario, data.plusDays(1), "Orcamento registrado."));
            historicos.add(criarHistoricoItem(solicitacao, EstadoSolicitacao.ORCADA, EstadoSolicitacao.APROVADA, funcionario, data.plusDays(2), "Orcamento aprovado pelo cliente."));
            HistoricoSolicitacao redirecionamento = criarHistoricoItem(solicitacao, EstadoSolicitacao.APROVADA, EstadoSolicitacao.REDIRECIONADA, funcionarioOrigem(funcionario), data.plusDays(3), "Solicitacao redirecionada para outro funcionario.");
            redirecionamento.setFuncionarioDestino(funcionario);
            historicos.add(redirecionamento);
        }
        case ARRUMADA -> {
            historicos.add(criarHistoricoItem(solicitacao, EstadoSolicitacao.ABERTA, EstadoSolicitacao.ORCADA, funcionario, data.plusDays(1), "Orcamento registrado."));
            historicos.add(criarHistoricoItem(solicitacao, EstadoSolicitacao.ORCADA, EstadoSolicitacao.APROVADA, funcionario, data.plusDays(2), "Orcamento aprovado pelo cliente."));
            historicos.add(criarHistoricoItem(solicitacao, EstadoSolicitacao.APROVADA, EstadoSolicitacao.ARRUMADA, funcionario, data.plusDays(3), "Manutencao concluida."));
        }
        case PAGA -> {
            historicos.add(criarHistoricoItem(solicitacao, EstadoSolicitacao.ABERTA, EstadoSolicitacao.ORCADA, funcionario, data.plusDays(1), "Orcamento registrado."));
            historicos.add(criarHistoricoItem(solicitacao, EstadoSolicitacao.ORCADA, EstadoSolicitacao.APROVADA, funcionario, data.plusDays(2), "Orcamento aprovado pelo cliente."));
            historicos.add(criarHistoricoItem(solicitacao, EstadoSolicitacao.APROVADA, EstadoSolicitacao.ARRUMADA, funcionario, data.plusDays(3), "Manutencao concluida."));
            historicos.add(criarHistoricoItem(solicitacao, EstadoSolicitacao.ARRUMADA, EstadoSolicitacao.PAGA, funcionario, data.plusDays(4), "Pagamento registrado."));
        }
        case FINALIZADA -> {
            historicos.add(criarHistoricoItem(solicitacao, EstadoSolicitacao.ABERTA, EstadoSolicitacao.ORCADA, funcionario, data.plusDays(1), "Orcamento registrado."));
            historicos.add(criarHistoricoItem(solicitacao, EstadoSolicitacao.ORCADA, EstadoSolicitacao.APROVADA, funcionario, data.plusDays(2), "Orcamento aprovado pelo cliente."));
            historicos.add(criarHistoricoItem(solicitacao, EstadoSolicitacao.APROVADA, EstadoSolicitacao.ARRUMADA, funcionario, data.plusDays(3), "Manutencao concluida."));
            historicos.add(criarHistoricoItem(solicitacao, EstadoSolicitacao.ARRUMADA, EstadoSolicitacao.PAGA, funcionario, data.plusDays(4), "Pagamento registrado."));
            historicos.add(criarHistoricoItem(solicitacao, EstadoSolicitacao.PAGA, EstadoSolicitacao.FINALIZADA, funcionario, data.plusDays(5), "Solicitacao finalizada."));
        }
    }

    return historicos;
}

private Funcionario funcionarioOrigem(Funcionario funcionarioDestino) {
    return funcRepository.findAll().stream()
        .filter(funcionario -> !funcionario.getId().equals(funcionarioDestino.getId()))
        .findFirst()
        .orElse(funcionarioDestino);
}

private HistoricoSolicitacao criarHistoricoItem(
    Solicitacao solicitacao,
    EstadoSolicitacao estadoAnterior,
    EstadoSolicitacao estadoNovo,
    Funcionario funcionario,
    LocalDateTime dataHora,
    String observacao) {

    HistoricoSolicitacao historico = new HistoricoSolicitacao();
    historico.setSolicitacao(solicitacao);
    historico.setEstadoAnterior(estadoAnterior);
    historico.setEstadoNovo(estadoNovo);
    historico.setFuncionario(funcionario);
    historico.setDataHora(dataHora);
    historico.setObservacao(observacao);
    return historico;
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
