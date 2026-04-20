package com.web.equipe5.manutencaoequipamentos.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import com.web.equipe5.manutencaoequipamentos.dto.request.LoginRequestDTO;
import com.web.equipe5.manutencaoequipamentos.dto.response.LoginResponseDTO;
import com.web.equipe5.manutencaoequipamentos.model.AuthenticatedUser;
import com.web.equipe5.manutencaoequipamentos.repository.ClienteRepository;
import com.web.equipe5.manutencaoequipamentos.repository.FuncionarioRepository;

@Service
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final ClienteRepository clienteRepository;
    private final FuncionarioRepository funcionarioRepository;

    public AuthService(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            ClienteRepository clienteRepository,
            FuncionarioRepository funcionarioRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.clienteRepository = clienteRepository;
        this.funcionarioRepository = funcionarioRepository;
    }

    public LoginResponseDTO login(LoginRequestDTO requisicao) {
        try {
            var authToken = new UsernamePasswordAuthenticationToken(requisicao.email(), requisicao.senha());
            var auth = authenticationManager.authenticate(authToken);

            AuthenticatedUser authenticatedUser = (AuthenticatedUser) auth.getPrincipal();

            String token = jwtService.generate(authenticatedUser);
            String nome = buscarNome(authenticatedUser);

            return new LoginResponseDTO(
                token,
                jwtService.getExpirationMs(),
                authenticatedUser.getId(),
                nome,
                authenticatedUser.getEmail(),
                authenticatedUser.getTipo().name()
            );
        } catch (Exception ex) {
            throw new BadCredentialsException("Login ou senha incorretos!");
        }
    }

    private String buscarNome(AuthenticatedUser authenticatedUser) {
        if(authenticatedUser.getTipo() == AuthenticatedUser.Tipo.CLIENTE) {
            return clienteRepository.findById(authenticatedUser.getId()).map(client -> client.getNome()).orElse("");
        }

        if(authenticatedUser.getTipo() == AuthenticatedUser.Tipo.FUNCIONARIO) {
            return funcionarioRepository.findById(authenticatedUser.getId()).map(funcionario -> funcionario.getNome()).orElse("");
        }

        return "";
    }
}
