package com.web.equipe5.manutencaoequipamentos.service;

import com.web.equipe5.manutencaoequipamentos.model.Funcionario;
import com.web.equipe5.manutencaoequipamentos.repository.FuncionarioRepository;
import com.web.equipe5.manutencaoequipamentos.exception.BusinessRuleException;
import com.web.equipe5.manutencaoequipamentos.exception.ResourceNotFoundException;

import java.time.format.DateTimeParseException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FuncionarioService {
    public final FuncionarioRepository repository;

    public FuncionarioService(FuncionarioRepository repository) {
        this.repository = repository;
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

    public Funcionario salvar(Funcionario funcionario) {
        if (funcionario.getNome() == null || funcionario.getNome().trim().isEmpty()) {
            throw new BusinessRuleException("Nome do funcionário é obrigatório.");
        }
        
        if (funcionario.getCpf() == null || funcionario.getCpf().trim().isEmpty()) {
            throw new BusinessRuleException("CPF do funcionário é obrigatório.");
        }
        
        if (funcionario.getEmail() == null || funcionario.getEmail().trim().isEmpty()) {
            throw new BusinessRuleException("Email do funcionário é obrigatório.");
        }
        
        if (funcionario.getSenha() == null || funcionario.getSenha().trim().isEmpty()) {
            throw new BusinessRuleException("Senha do funcionário é obrigatória.");
        }
        
        if (funcionario.getCargo() == null || funcionario.getCargo().trim().isEmpty()) {
            throw new BusinessRuleException("Cargo do funcionário é obrigatório.");
        }
        
        if (repository.existsByCpf(funcionario.getCpf())) {
            throw new BusinessRuleException("Já existe um funcionário com este CPF.");
        }
        
        if (repository.existsByEmail(funcionario.getEmail())) {
            throw new BusinessRuleException("Já existe um funcionário com este email.");
        }
        
        if (funcionario.getAtivo() == null) {
            funcionario.setAtivo(true);
        }
        
        return repository.save(funcionario);
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
                    funcionarioExistente.setEmail((String) valor);  // ← pode ser 'novoEmail'
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
                case "cargo":
                    funcionarioExistente.setCargo((String) valor);
                    break;
                case "ativo":
                    funcionarioExistente.setAtivo((Boolean) valor);
                    break;
                case "cpf":  
                    throw new BusinessRuleException("Não é permitido alterar o CPF!");
                case "senha": 
                    funcionarioExistente.setSenha((String) valor);
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
