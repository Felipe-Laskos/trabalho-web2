package com.web.equipe5.manutencaoequipamentos.controller;

import com.web.equipe5.manutencaoequipamentos.dto.response.CategoriaEquipamentoResponseDTO;
import com.web.equipe5.manutencaoequipamentos.mapper.CategoriaEquipamentoMapper;
import com.web.equipe5.manutencaoequipamentos.model.CategoriaEquipamento;
import com.web.equipe5.manutencaoequipamentos.service.CategoriaEquipamentoService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.stream.Collectors;
import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaEquipamentoController {

    private final CategoriaEquipamentoService service;

    public CategoriaEquipamentoController(CategoriaEquipamentoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<CategoriaEquipamentoResponseDTO>> listarTodas() {
        List<CategoriaEquipamento> categorias = service.listarTodas();

        List<CategoriaEquipamentoResponseDTO> response = categorias.stream()
            .map(CategoriaEquipamentoMapper::toDTO) 
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/ativas")
    public ResponseEntity<List<CategoriaEquipamentoResponseDTO>> listarAtivas() {
        List<CategoriaEquipamento> categorias = service.listarAtivas();

        List<CategoriaEquipamentoResponseDTO> response = categorias.stream()
            .map(CategoriaEquipamentoMapper::toDTO)
            .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaEquipamentoResponseDTO> buscarPorId(@PathVariable Long id) {
        CategoriaEquipamento categoria = service.buscarPorId(id);
        return ResponseEntity.ok(CategoriaEquipamentoMapper.toDTO(categoria));
    }
    
    @PostMapping
    public ResponseEntity<CategoriaEquipamentoResponseDTO> criar(
        @RequestBody CategoriaEquipamento requisicao) {
        CategoriaEquipamento novaCategoria = service.salvar(requisicao);
        return ResponseEntity.status(201).body(CategoriaEquipamentoMapper.toDTO(novaCategoria));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<CategoriaEquipamentoResponseDTO> atualizar(
            @PathVariable Long id, 
            @RequestBody Map<String, Object> campos) {
        CategoriaEquipamento categoriaAtualizada = service.atualizar(id, campos);
        return ResponseEntity.ok(CategoriaEquipamentoMapper.toDTO(categoriaAtualizada));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<CategoriaEquipamentoResponseDTO> deletar(@PathVariable Long id) {
        CategoriaEquipamento categoriaDeletada = service.deletar(id);
        return ResponseEntity.ok(CategoriaEquipamentoMapper.toDTO(categoriaDeletada));
    }
}