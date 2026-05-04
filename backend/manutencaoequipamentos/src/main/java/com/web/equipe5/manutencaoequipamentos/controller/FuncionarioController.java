package com.web.equipe5.manutencaoequipamentos.controller;

import com.web.equipe5.manutencaoequipamentos.dto.request.FuncionarioRequestDTO;
import com.web.equipe5.manutencaoequipamentos.dto.response.FuncionarioResponseDTO;
import com.web.equipe5.manutencaoequipamentos.model.Funcionario;
import com.web.equipe5.manutencaoequipamentos.service.FuncionarioService;
import com.web.equipe5.manutencaoequipamentos.mapper.FuncionarioMapper;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map; 
import java.util.stream.Collectors;
import java.util.List;

@RestController
@RequestMapping("/api/funcionarios")
public class FuncionarioController {

    private final FuncionarioService service;

    public FuncionarioController(FuncionarioService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<FuncionarioResponseDTO>> listar() {
        List<Funcionario> lista = service.listarTodos();
        List<FuncionarioResponseDTO> response = lista.stream()
            .map(FuncionarioMapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/ativos")
    public ResponseEntity<List<FuncionarioResponseDTO>> listarAtivos() {
        List<Funcionario> lista = service.listarAtivos();
        List<FuncionarioResponseDTO> response = lista.stream()
            .map(FuncionarioMapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FuncionarioResponseDTO> buscarPorId(@PathVariable Long id) {
        Funcionario fun = service.buscarPorId(id);  
        return ResponseEntity.ok(FuncionarioMapper.toDTO(fun));
    }
    
    @GetMapping("/email/{email}")
    public ResponseEntity<FuncionarioResponseDTO> buscarPorEmail(@PathVariable String email) {
        Funcionario fun = service.buscarPorEmail(email);  
        return ResponseEntity.ok(FuncionarioMapper.toDTO(fun));
    }

    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<FuncionarioResponseDTO> buscarPorCpf(@PathVariable String cpf) {
        Funcionario fun = service.buscarPorCpf(cpf); 
        return ResponseEntity.ok(FuncionarioMapper.toDTO(fun));
    }

    @PostMapping
    public ResponseEntity<FuncionarioResponseDTO> criar(@RequestBody FuncionarioRequestDTO requisicao) {
        FuncionarioResponseDTO novoFuncionario = service.salvar(requisicao);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoFuncionario);
    }
    
    @PatchMapping("/{id}")  
    public ResponseEntity<FuncionarioResponseDTO> atualizarParcial(
            @PathVariable Long id, 
            @RequestBody Map<String, Object> campos) {
        Funcionario funcionarioAtualizado = service.atualizar(id, campos);
        return ResponseEntity.ok(FuncionarioMapper.toDTO(funcionarioAtualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<FuncionarioResponseDTO> deletar(
        @PathVariable Long id, 
        @RequestHeader("funcionario-id") Long idFuncionarioLogado) {
        Funcionario fun = service.deletar(id, idFuncionarioLogado);  
        return ResponseEntity.ok(FuncionarioMapper.toDTO(fun));
    }
}