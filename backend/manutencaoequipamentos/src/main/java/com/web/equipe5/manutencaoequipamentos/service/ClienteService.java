package com.web.equipe5.manutencaoequipamentos.service;

import org.springframework.stereotype.Service;

import com.web.equipe5.manutencaoequipamentos.dto.request.ClienteRequestDTO;
import com.web.equipe5.manutencaoequipamentos.dto.response.ClienteResponseDTO;
import com.web.equipe5.manutencaoequipamentos.exception.BusinessRuleException;
import com.web.equipe5.manutencaoequipamentos.mapper.ClienteMapper;
import com.web.equipe5.manutencaoequipamentos.model.Cliente;
import com.web.equipe5.manutencaoequipamentos.repository.ClienteRepository;

import jakarta.transaction.Transactional;

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
}
