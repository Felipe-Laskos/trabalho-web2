package com.web.equipe5.manutencaoequipamentos.controller;

import com.web.equipe5.manutencaoequipamentos.dto.request.FuncionarioRequestDTO;
import com.web.equipe5.manutencaoequipamentos.dto.response.FuncionarioResponseDTO;
import com.web.equipe5.manutencaoequipamentos.model.Funcionario;
import com.web.equipe5.manutencaoequipamentos.service.FuncionarioService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map; 
import java.util.List;

@RestController
@RequestMapping("/api/funcionarios")
public class FuncionarioController {

    private final FuncionarioService service;

    public FuncionarioController(FuncionarioService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Funcionario>> listar() {
        List<Funcionario> lista = service.listarAtivos();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Funcionario> buscarPorId(@PathVariable Long id) {
        Funcionario fun = service.buscarPorId(id);  
        return ResponseEntity.ok(fun);
    }
    
    @GetMapping("/email/{email}")
    public ResponseEntity<Funcionario> buscarPorEmail(@PathVariable String email) {
        Funcionario fun = service.buscarPorEmail(email);  
        return ResponseEntity.ok(fun);
    }

    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<Funcionario> buscarPorCpf(@PathVariable String cpf) {
        Funcionario fun = service.buscarPorCpf(cpf); 
        return ResponseEntity.ok(fun);
    }

    @PostMapping
    public ResponseEntity<FuncionarioResponseDTO> criar(@RequestBody FuncionarioRequestDTO requisicao) {
        FuncionarioResponseDTO novoFuncionario = service.salvar(requisicao);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoFuncionario);
    }
    
    @PatchMapping("/{id}")  
    public ResponseEntity<Funcionario> atualizarParcial(
            @PathVariable Long id, 
            @RequestBody Map<String, Object> campos) {
        Funcionario funcionarioAtualizado = service.atualizar(id, campos);
        return ResponseEntity.ok(funcionarioAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Funcionario> deletar(
        @PathVariable Long id,
        @RequestHeader("funcionario-id") Long idFuncionarioLogado) {
        Funcionario fun = service.deletar(id, idFuncionarioLogado);  
        return ResponseEntity.ok(fun);
    }
}