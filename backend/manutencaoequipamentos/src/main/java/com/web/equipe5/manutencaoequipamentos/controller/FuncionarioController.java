package com.web.equipe5.manutencaoequipamentos.controller;

import com.web.equipe5.manutencaoequipamentos.exception.ResourceNotFoundException;
import com.web.equipe5.manutencaoequipamentos.model.Funcionario;
import com.web.equipe5.manutencaoequipamentos.repository.FuncionarioRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/funcionarios")
public class FuncionarioController {

    private final FuncionarioRepository repository;

    public FuncionarioController(FuncionarioRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<List<Funcionario>> listar() {
        List<Funcionario> lista = repository.findByAtivoTrue();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Funcionario> buscarPorEmail(@PathVariable String email) {
        Funcionario fun = repository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Funcionário não encontrado"));
        return ResponseEntity.ok(fun);
    }

    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<Funcionario> buscarPorCpf(@PathVariable String cpf) {
        Funcionario fun = repository.findByCpf(cpf)
                .orElseThrow(() -> new ResourceNotFoundException("Funcionário não encontrado"));
        return ResponseEntity.ok(fun);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Funcionario> deletar(@PathVariable Long id) {
    Funcionario fun = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Funcionário não encontrado"));
    fun.setAtivo(false);
    return ResponseEntity.ok(repository.save(fun));
 }
}