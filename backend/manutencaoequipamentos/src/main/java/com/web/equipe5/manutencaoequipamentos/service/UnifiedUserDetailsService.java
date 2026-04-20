package com.web.equipe5.manutencaoequipamentos.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.web.equipe5.manutencaoequipamentos.model.AuthenticatedUser;
import com.web.equipe5.manutencaoequipamentos.repository.ClienteRepository;
import com.web.equipe5.manutencaoequipamentos.repository.FuncionarioRepository;

@Service
public class UnifiedUserDetailsService implements UserDetailsService {
    private final FuncionarioRepository funcionarioRepository;
    private final ClienteRepository clienteRepository;

    public UnifiedUserDetailsService(ClienteRepository clienteRepository, FuncionarioRepository funcionarioRepository) {
        this.clienteRepository = clienteRepository;
        this.funcionarioRepository = funcionarioRepository;;
    }

    @Override
    public UserDetails loadUserByUsername(String email) {
        return clienteRepository.findByEmail(email)
            .map(cliente -> new AuthenticatedUser(
                cliente.getId(),
                cliente.getEmail(),
                cliente.getSalt() + ":" + cliente.getSenha(),
                AuthenticatedUser.Tipo.CLIENTE,
                Boolean.TRUE.equals(cliente.getAtivo())
            ))
            .map(UserDetails.class::cast)
            .or(() -> funcionarioRepository.findByEmail(email)
                .map(funcionario -> new AuthenticatedUser(
                    funcionario.getId(),
                    funcionario.getEmail(),
                    funcionario.getSalt() + ":" + funcionario.getSenha(),
                    AuthenticatedUser.Tipo.FUNCIONARIO,
                    Boolean.TRUE.equals(funcionario.getAtivo())
                )))
            .orElseThrow(() -> new UsernameNotFoundException("Email não cadastrado: " + email));

    }
}
