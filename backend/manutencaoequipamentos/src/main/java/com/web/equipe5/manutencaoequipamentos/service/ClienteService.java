package com.web.equipe5.manutencaoequipamentos.service;

import org.springframework.stereotype.Service;

import com.web.equipe5.manutencaoequipamentos.dto.request.ClienteRequestDTO;
import com.web.equipe5.manutencaoequipamentos.dto.response.ClienteResponseDTO;
import com.web.equipe5.manutencaoequipamentos.exception.BusinessRuleException;
import com.web.equipe5.manutencaoequipamentos.exception.ResourceNotFoundException;
import com.web.equipe5.manutencaoequipamentos.mapper.ClienteMapper;
import com.web.equipe5.manutencaoequipamentos.mapper.EnderecoMapper;
import com.web.equipe5.manutencaoequipamentos.model.Cliente;
import com.web.equipe5.manutencaoequipamentos.repository.ClienteRepository;
import com.web.equipe5.manutencaoequipamentos.dto.ClientePatchDTO;

import jakarta.transaction.Transactional;

import java.util.List;

@Service
public class ClienteService {
    private final ClienteRepository clienteRepository;
    private final HashService hashService;
    private final EmailService emailService;

    public ClienteService(
        ClienteRepository clienteRepository,
        HashService hashService,
        EmailService emailService) {
        this.clienteRepository = clienteRepository;
        this.hashService = hashService;
        this.emailService = emailService;
    }

    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();
    }

    public List<Cliente> listarAtivos() {
        return clienteRepository.findByAtivoTrue();
    }

    public Cliente buscarPorId(Long id) {
        return clienteRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com ID: " + id));
    }

    public Cliente buscarPorEmail(String email) {
        return clienteRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com email: " + email));
    }

    public Cliente buscarPorCpf(String cpf) {
        return clienteRepository.findByCpf(cpf)
            .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com CPF: " + cpf));
    }

    @Transactional
    public ClienteResponseDTO autocadastrar(ClienteRequestDTO requisicao) {
        if (clienteRepository.findByEmail(requisicao.email()).isPresent()) {
            throw new BusinessRuleException("E-mail já cadastrado");
        }
        if (clienteRepository.findByCpf(requisicao.cpf()).isPresent()) {
            throw new BusinessRuleException("CPF já cadastrado");
        }

        String senhaBruta = hashService.gerarSenha();
        String saltHex = hashService.gerarSaltHex();
        String hashHex = hashService.sha256Hex(senhaBruta, saltHex);

        Cliente cliente = ClienteMapper.toEntity(requisicao);
        cliente.setSenha(hashHex);
        cliente.setSalt(saltHex);

        Cliente salvo = clienteRepository.save(cliente);
        emailService.enviarSenhaAutocadastro(salvo.getEmail(), salvo.getNome(), senhaBruta);

        return ClienteMapper.toDTO(salvo);
    }
    
    @Transactional
    public ClienteResponseDTO salvar(ClienteRequestDTO requisicao) {
        if (requisicao.nome() == null || requisicao.nome().trim().isEmpty()) {
            throw new BusinessRuleException("Nome do cliente é obrigatório.");
        }
        
        if (requisicao.cpf() == null || requisicao.cpf().trim().isEmpty()) {
            throw new BusinessRuleException("CPF do cliente é obrigatório.");
        }
        
        if (requisicao.email() == null || requisicao.email().trim().isEmpty()) {
            throw new BusinessRuleException("Email do cliente é obrigatório.");
        }

        if (requisicao.telefone() == null || requisicao.telefone().trim().isEmpty()) {
            throw new BusinessRuleException("Telefone do cliente é obrigatório.");
        }
        
        if (clienteRepository.existsByCpf(requisicao.cpf())) {
            throw new BusinessRuleException("Já existe um cliente com este CPF.");
        }
        
        if (clienteRepository.existsByEmail(requisicao.email())) {
            throw new BusinessRuleException("Já existe um cliente com este email.");
        }
        
        String senhaBruta = hashService.gerarSenha();
        String saltHex = hashService.gerarSaltHex();
        String hashHex = hashService.sha256Hex(senhaBruta, saltHex);

        Cliente cliente = ClienteMapper.toEntity(requisicao);
        cliente.setSenha(hashHex);
        cliente.setSalt(saltHex);
        
        Cliente salvo = clienteRepository.save(cliente);
        emailService.enviarSenhaAutocadastro(salvo.getEmail(), salvo.getNome(), senhaBruta);

        return ClienteMapper.toDTO(salvo);
    }

    public Cliente atualizar(Long id, ClientePatchDTO patchDTO) {
        Cliente clienteExistente = clienteRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com ID: " + id));
        
        if (patchDTO.nome() != null) {
            clienteExistente.setNome(patchDTO.nome());
        }
        if (patchDTO.email() != null) {
            String novoEmail = patchDTO.email();
            if (clienteRepository.existsByEmail(novoEmail)) {
                Cliente clienteComEsteEmail = clienteRepository.findByEmail(novoEmail).get();
                if (!clienteComEsteEmail.getId().equals(clienteExistente.getId())) {
                    throw new BusinessRuleException("Email já está em uso por outro cliente: " + novoEmail);
                }
            }
            clienteExistente.setEmail(novoEmail);
        }
        if (patchDTO.ativo() != null) {
            clienteExistente.setAtivo(patchDTO.ativo());
        }

        if (patchDTO.senha() != null) {
            String novaSenha = patchDTO.senha();
            String novoSalt = hashService.gerarSaltHex();
            String novoHash = hashService.sha256Hex(novaSenha, novoSalt);

            clienteExistente.setSalt(novoSalt);
            clienteExistente.setSenha(novoHash);
        }

        if (patchDTO.telefone() != null) {
            clienteExistente.setTelefone(patchDTO.telefone());
        }

        if (patchDTO.endereco() != null) {
            clienteExistente.setEndereco(
                EnderecoMapper.toEntity(patchDTO.endereco())
            );
        }

        return clienteRepository.save(clienteExistente);
    }

    public Cliente deletar(Long id, Long idFuncionarioLogado) {

        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Funcionario não encontrado")); 

        long totalAtivos = clienteRepository.countByAtivoTrue();
        if (totalAtivos <= 1) {
            throw new BusinessRuleException("Não é possível remover o único funcionário ativo do sistema!");
        }
            
        cliente.setAtivo(false);
        return clienteRepository.save(cliente);
    }
}
