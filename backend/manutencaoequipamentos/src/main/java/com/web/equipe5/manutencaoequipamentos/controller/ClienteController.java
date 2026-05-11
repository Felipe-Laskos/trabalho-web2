package com.web.equipe5.manutencaoequipamentos.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.web.equipe5.manutencaoequipamentos.dto.request.ClienteRequestDTO;
import com.web.equipe5.manutencaoequipamentos.dto.response.ClienteResponseDTO;
import com.web.equipe5.manutencaoequipamentos.service.ClienteService;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {
    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @PostMapping
    public ResponseEntity<ClienteResponseDTO> autocadastrar(@RequestBody ClienteRequestDTO requisicao) {
        ClienteResponseDTO response = clienteService.autocadastrar(requisicao);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
