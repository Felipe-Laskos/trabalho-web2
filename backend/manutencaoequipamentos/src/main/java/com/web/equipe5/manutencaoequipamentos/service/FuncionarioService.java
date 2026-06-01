package com.web.equipe5.manutencaoequipamentos.service;

import com.web.equipe5.manutencaoequipamentos.dto.request.FuncionarioRequestDTO;
import com.web.equipe5.manutencaoequipamentos.dto.request.FuncionarioUpdateRequestDTO;
import com.web.equipe5.manutencaoequipamentos.dto.response.FuncionarioResponseDTO;
import com.web.equipe5.manutencaoequipamentos.mapper.FuncionarioMapper;
import com.web.equipe5.manutencaoequipamentos.model.Funcionario;
import com.web.equipe5.manutencaoequipamentos.repository.FuncionarioRepository;
import com.web.equipe5.manutencaoequipamentos.exception.BusinessRuleException;
import com.web.equipe5.manutencaoequipamentos.exception.ResourceNotFoundException;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class FuncionarioService {
    public final FuncionarioRepository repository;
    private final HashService hashService;
    private final EmailService emailService;

    public FuncionarioService(
        FuncionarioRepository repository,
        HashService hashService,
        EmailService emailService) {
        this.repository = repository;
        this.hashService = hashService;
        this.emailService = emailService;
    }

    public Page<Funcionario> listarTodos(String termo, Pageable pageable) {
        String termoNormalizado = normalizarTermo(termo);

        if (termoNormalizado.isEmpty()) {
            return repository.findAll(pageable);
        }

        return repository.findByNomeContainingIgnoreCase(termoNormalizado, pageable);
    }
    
    public Page<Funcionario> listarAtivos(String termo, Pageable pageable) {
        String termoNormalizado = normalizarTermo(termo);

        if (termoNormalizado.isEmpty()) {
            return repository.findByAtivoTrue(pageable);
        }

        return repository.findByAtivoTrueAndNomeContainingIgnoreCase(termoNormalizado, pageable);
    }

    public Page<Funcionario> listarInativos(String termo, Pageable pageable) {
        String termoNormalizado = normalizarTermo(termo);

        if (termoNormalizado.isEmpty()) {
            return repository.findByAtivoFalse(pageable);
        }

        return repository.findByAtivoFalseAndNomeContainingIgnoreCase(termoNormalizado, pageable);
    }

    private String normalizarTermo(String termo) {
        return termo == null ? "" : termo.trim();
    }

    public Funcionario buscarPorId(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Funcionário não encontrado com ID: " + id));
    }

    public Funcionario buscarPorEmail(String email) {
        return repository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("Funcionário não encontrado com email: " + email));
    }

    public Funcionario buscarPorCpf(String cpf) {
        return repository.findByCpf(cpf)
            .orElseThrow(() -> new ResourceNotFoundException("Funcionário não encontrado com CPF: " + cpf));
    }

    @Transactional
    public FuncionarioResponseDTO salvar(FuncionarioRequestDTO requisicao) {
        if (requisicao.nome() == null || requisicao.nome().trim().isEmpty()) {
            throw new BusinessRuleException("Nome do funcionário é obrigatório.");
        }
        
        if (requisicao.cpf() == null || requisicao.cpf().trim().isEmpty()) {
            throw new BusinessRuleException("CPF do funcionário é obrigatório.");
        }
        
        if (requisicao.email() == null || requisicao.email().trim().isEmpty()) {
            throw new BusinessRuleException("Email do funcionário é obrigatório.");
        }
        
        if (requisicao.cargo() == null || requisicao.cargo().trim().isEmpty()) {
            throw new BusinessRuleException("Cargo do funcionário é obrigatório.");
        }

        if (requisicao.dataNascimento() == null) {
            throw new BusinessRuleException("Data de nascimento do funcionário é obrigatório.");
        }

        if (requisicao.dataNascimento().isAfter(java.time.LocalDate.now())) {
            throw new BusinessRuleException("Data de nascimento não pode ser no futuro.");
        }

        int idade = java.time.Period
            .between(requisicao.dataNascimento(), java.time.LocalDate.now())
            .getYears();

        if (idade < 18) {
            throw new BusinessRuleException("O funcionário deve ser maior de idade.");
        }
        
        if (repository.existsByCpf(requisicao.cpf())) {
            throw new BusinessRuleException("Já existe um funcionário com este CPF.");
        }
        
        if (repository.existsByEmail(requisicao.email())) {
            throw new BusinessRuleException("Já existe um funcionário com este email.");
        }

        String senhaBruta;
        if (requisicao.senha() != null && !requisicao.senha().isBlank()) {
            if (requisicao.senha().trim().length() < 4) {
                throw new BusinessRuleException("A senha deve conter no mínimo 4 caracteres.");
            }
            senhaBruta = requisicao.senha();
        } else {
            senhaBruta = hashService.gerarSenha();
        }

        String saltHex = hashService.gerarSaltHex();
        String hashHex = hashService.sha256Hex(senhaBruta, saltHex);

        Funcionario funcionario = FuncionarioMapper.toEntity(requisicao);
        funcionario.setSenha(hashHex);
        funcionario.setSalt(saltHex);
        
        Funcionario salvo = repository.save(funcionario);
        emailService.enviarSenhaAutocadastro(salvo.getEmail(), salvo.getNome(), senhaBruta);

        return FuncionarioMapper.toDTO(salvo);
    }

    public Funcionario atualizar(Long id, FuncionarioUpdateRequestDTO requisicao) {
        Funcionario funcionarioExistente = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Funcionario não encontrada com ID: " + id));

        if (requisicao.nome() != null) {
            funcionarioExistente.setNome(requisicao.nome());
        }

        if (requisicao.email() != null) {
            String novoEmail = requisicao.email();

            if (repository.existsByEmail(novoEmail)) {
                Funcionario funcionarioComEsteEmail = repository.findByEmail(novoEmail).get();

                if (!funcionarioComEsteEmail.getId().equals(funcionarioExistente.getId())) {
                    throw new BusinessRuleException("Email já está em uso por outro funcionário: " + novoEmail);
                }
            }
            funcionarioExistente.setEmail(novoEmail);
        }

        if (requisicao.cargo() != null) {
            funcionarioExistente.setCargo(requisicao.cargo());
        }

        if (requisicao.ativo() != null) {
            funcionarioExistente.setAtivo(requisicao.ativo());
        }

        if (requisicao.senha() != null) {
            String novoSalt = hashService.gerarSaltHex();
            String novoHash = hashService.sha256Hex(requisicao.senha(), novoSalt);

            funcionarioExistente.setSalt(novoSalt);
            funcionarioExistente.setSenha(novoHash);
        }

        if (requisicao.dataNascimento() != null) {
            funcionarioExistente.setDataNascimento(requisicao.dataNascimento());
        }

        return repository.save(funcionarioExistente);
    }

    public Funcionario deletar(Long id, Long idFuncionarioLogado) {
        if (id.equals(idFuncionarioLogado)) {
            throw new BusinessRuleException("Você não pode remover seu próprio cadastro!");
        }    

        Funcionario fun = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Funcionario não encontrado"));
                
        if(Boolean.FALSE.equals(fun.getAtivo())){
            throw new BusinessRuleException(
                "Funcionário já está inativo."
            );
        }

        long totalAtivos = repository.countByAtivoTrue();
        if (totalAtivos <= 1) {
            throw new BusinessRuleException("Não é possível remover o único funcionário ativo do sistema!");
        }
            
        fun.setAtivo(false);
        return repository.save(fun);
    }

    public Funcionario reativar(Long id) {
        Funcionario funcionario =
            repository.findById(id)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Funcionário não encontrado"
                )
            );

        if(Boolean.TRUE.equals(
            funcionario.getAtivo()
        )){
            throw new BusinessRuleException(
                "Funcionário já está ativo."
            );
        }

        funcionario.setAtivo(true);

        return repository.save(
            funcionario
        );
    }
}
