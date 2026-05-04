package com.web.equipe5.manutencaoequipamentos.service;

import com.web.equipe5.manutencaoequipamentos.dto.request.FuncionarioRequestDTO;
import com.web.equipe5.manutencaoequipamentos.dto.response.FuncionarioResponseDTO;
import com.web.equipe5.manutencaoequipamentos.mapper.FuncionarioMapper;
import com.web.equipe5.manutencaoequipamentos.model.Funcionario;
import com.web.equipe5.manutencaoequipamentos.repository.FuncionarioRepository;
import com.web.equipe5.manutencaoequipamentos.exception.BusinessRuleException;
import com.web.equipe5.manutencaoequipamentos.exception.ResourceNotFoundException;

import jakarta.transaction.Transactional;
import java.time.format.DateTimeParseException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;

import org.springframework.stereotype.Service;

import java.util.List;

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

    public List<Funcionario> listarTodos() {
        return repository.findAll();
    }
    
    public List<Funcionario> listarAtivos() {
        return repository.findByAtivoTrue();
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
        
        if (repository.existsByCpf(requisicao.cpf())) {
            throw new BusinessRuleException("Já existe um funcionário com este CPF.");
        }
        
        if (repository.existsByEmail(requisicao.email())) {
            throw new BusinessRuleException("Já existe um funcionário com este email.");
        }
        
        String senhaBruta = hashService.gerarSenha();
        String saltHex = hashService.gerarSaltHex();
        String hashHex = hashService.sha256Hex(senhaBruta, saltHex);

        Funcionario funcionario = FuncionarioMapper.toEntity(requisicao);
        funcionario.setSenha(hashHex);
        funcionario.setSalt(saltHex);
        
        Funcionario salvo = repository.save(funcionario);
        emailService.enviarSenhaAutocadastro(salvo.getEmail(), salvo.getNome(), senhaBruta);

        return FuncionarioMapper.toDTO(salvo);
    }

    public Funcionario atualizar(Long id, Map<String, Object> campos) {
        Funcionario funcionarioExistente = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Funcionario não encontrada com ID: " + id));
        
        campos.forEach((campo, valor) -> {
            if (valor != null) {
                switch (campo) {
                case "nome":
                    funcionarioExistente.setNome((String) valor);
                    break;
                case "email":
                    String novoEmail = (String) valor;
                    
                    if (repository.existsByEmail(novoEmail)) {
                        Funcionario funcionarioComEsteEmail = repository.findByEmail(novoEmail).get();
                        
                        if (!funcionarioComEsteEmail.getId().equals(funcionarioExistente.getId())) {
                            throw new BusinessRuleException("Email já está em uso por outro funcionário: " + novoEmail);
                        }
                    }
                    funcionarioExistente.setEmail((String) valor);  
                    break;
                case "cargo":
                    funcionarioExistente.setCargo((String) valor);
                    break;
                case "ativo":
                    funcionarioExistente.setAtivo((Boolean) valor);
                    break;
                case "cpf":  
                    throw new BusinessRuleException("Não é permitido alterar o CPF!");
                case "senha":
                    String novaSenha = (String) valor;
                    String novoSalt = hashService.gerarSaltHex();
                    String novoHash = hashService.sha256Hex(novaSenha, novoSalt);

                    funcionarioExistente.setSalt(novoSalt);
                    funcionarioExistente.setSenha(novoHash);
                    break;
                case "dataNascimento": 
                    if (valor instanceof String) {
                            // formato YYY-MM-dd (ISO)
                            String dataStr = (String) valor;
                            try {
                                funcionarioExistente.setDataNascimento(LocalDate.parse(dataStr));
                            } catch (DateTimeParseException e) {
                                // aqui pega formato brasileiro dd-MM-YYYY
                                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
                                funcionarioExistente.setDataNascimento(LocalDate.parse(dataStr, formatter));
                            }
                    } else if (valor instanceof LocalDate) {
                        funcionarioExistente.setDataNascimento((LocalDate) valor);
                    }
                    break;
                default:
                    throw new BusinessRuleException("Campo desconhecido" + campo);
                }
            }
        });
        return repository.save(funcionarioExistente);
    }

    public Funcionario deletar(Long id, Long idFuncionarioLogado) {
        if (id.equals(idFuncionarioLogado)) {
            throw new BusinessRuleException("Você não pode remover seu próprio cadastro!");
        }    

        Funcionario fun = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Funcionario não encontrado")); 

        long totalAtivos = repository.countByAtivoTrue();
        if (totalAtivos <= 1) {
            throw new BusinessRuleException("Não é possível remover o único funcionário ativo do sistema!");
        }
            
        fun.setAtivo(false);
        return repository.save(fun);
    }
}
