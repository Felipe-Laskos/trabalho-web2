package com.web.equipe5.manutencaoequipamentos.controller;

import com.web.equipe5.manutencaoequipamentos.model.CategoriaEquipamento;
import com.web.equipe5.manutencaoequipamentos.repository.CategoriaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categorias")
public class CategoriaEquipamentoController {

    private final CategoriaRepository repository;

    public CategoriaEquipamentoController(CategoriaRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<CategoriaEquipamento> listar() {
        return repository.findByAtivoTrue();
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
    CategoriaEquipamento cat = repository.findById(id).orElseThrow();
    cat.setAtivo(false);
    repository.save(cat);
 }
}
