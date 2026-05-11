package com.web.equipe5.manutencaoequipamentos.controller;

import com.web.equipe5.manutencaoequipamentos.model.CategoriaEquipamento;
import com.web.equipe5.manutencaoequipamentos.service.CategoriaEquipamentoService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;


@RestController
@RequestMapping("/api/categorias")
public class CategoriaEquipamentoController {

    private final CategoriaEquipamentoService service;

    public CategoriaEquipamentoController(CategoriaEquipamentoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<CategoriaEquipamento>> listar() {
        return ResponseEntity.ok(service.listarAtivas());
    }
    
    @PostMapping
    public ResponseEntity<CategoriaEquipamento> criar(@RequestBody CategoriaEquipamento categoria) {
        CategoriaEquipamento novaCategoria = service.salvar(categoria);
        return ResponseEntity.status(201).body(novaCategoria);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<CategoriaEquipamento> atualizar(
            @PathVariable Long id, 
            @RequestBody Map<String, Object> campos) {
        CategoriaEquipamento categoriaAtualizada = service.atualizar(id, campos);
        return ResponseEntity.ok(categoriaAtualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<CategoriaEquipamento> deletar(@PathVariable Long id) {
        return ResponseEntity.ok(service.deletar(id));
    }
}