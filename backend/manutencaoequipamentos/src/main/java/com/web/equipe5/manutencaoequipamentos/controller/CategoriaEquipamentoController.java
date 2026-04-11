package com.web.equipe5.manutencaoequipamentos.controller;

import com.web.equipe5.manutencaoequipamentos.exception.ResourceNotFoundException;
import com.web.equipe5.manutencaoequipamentos.model.CategoriaEquipamento;
import com.web.equipe5.manutencaoequipamentos.repository.CategoriaRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaEquipamentoController {

    private final CategoriaRepository repository;

    public CategoriaEquipamentoController(CategoriaRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<List<CategoriaEquipamento>> listar() {
        List<CategoriaEquipamento> lista = repository.findByAtivoTrue();
        return ResponseEntity.ok(lista);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<CategoriaEquipamento> deletar(@PathVariable Long id) {
    CategoriaEquipamento cat = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada: "));
    cat.setAtivo(false);
    return ResponseEntity.ok(repository.save(cat));
 }
}
