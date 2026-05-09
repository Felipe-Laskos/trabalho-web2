package com.web.equipe5.manutencaoequipamentos.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.web.equipe5.manutencaoequipamentos.model.Cliente;
import com.web.equipe5.manutencaoequipamentos.mapper.ClienteMapper;
import com.web.equipe5.manutencaoequipamentos.dto.request.ClienteRequestDTO;
import com.web.equipe5.manutencaoequipamentos.dto.response.ClienteResponseDTO;
import com.web.equipe5.manutencaoequipamentos.service.ClienteService;

import org.springframework.web.bind.annotation.*;
import java.util.Map; 
import java.util.stream.Collectors;
import java.util.List;

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

    @GetMapping
    public ResponseEntity<List<ClienteResponseDTO>> listar() {
        List<Cliente> lista = clienteService.listarTodos();
        List<ClienteResponseDTO> response = lista.stream()
            .map(ClienteMapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/ativos")
    public ResponseEntity<List<ClienteResponseDTO>> listarAtivos() {
        List<Cliente> lista = clienteService.listarAtivos();
        List<ClienteResponseDTO> response = lista.stream()
            .map(ClienteMapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> buscarPorId(@PathVariable Long id) {
        Cliente cliente = clienteService.buscarPorId(id);
        return ResponseEntity.status(HttpStatus.OK).body(ClienteMapper.toDTO(cliente));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<ClienteResponseDTO> buscarPorEmail(@PathVariable String email) {
        Cliente cliente = clienteService.buscarPorEmail(email);
        return ResponseEntity.status(HttpStatus.OK).body(ClienteMapper.toDTO(cliente));
    }

    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<ClienteResponseDTO> buscarPorCpf(@PathVariable String cpf) {
        Cliente cliente = clienteService.buscarPorCpf(cpf);
        return ResponseEntity.status(HttpStatus.OK).body(ClienteMapper.toDTO(cliente));
    }

    @PostMapping("/cadastrar")
    public ResponseEntity<ClienteResponseDTO> criar(@RequestBody ClienteRequestDTO requisicao) {
        ClienteResponseDTO novoCliente = clienteService.salvar(requisicao);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoCliente);
    }

    @PatchMapping("/{id}")  
    public ResponseEntity<ClienteResponseDTO> atualizarParcial(
            @PathVariable Long id, 
            @RequestBody Map<String, Object> campos) {
        Cliente clienteAtualizado = clienteService.atualizar(id, campos);
        return ResponseEntity.status(HttpStatus.OK).body(ClienteMapper.toDTO(clienteAtualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> deletar(
        @PathVariable Long id, 
        @RequestHeader("cliente-id") Long idFuncionarioLogado) {
        Cliente cliente = clienteService.deletar(id, idFuncionarioLogado);  
        return ResponseEntity.status(HttpStatus.OK).body(ClienteMapper.toDTO(cliente));
    }
}
