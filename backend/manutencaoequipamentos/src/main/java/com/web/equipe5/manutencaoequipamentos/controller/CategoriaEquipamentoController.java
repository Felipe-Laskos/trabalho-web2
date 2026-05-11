package com.web.equipe5.manutencaoequipamentos.controller;

import com.web.equipe5.manutencaoequipamentos.dto.request.CategoriaEquipamentoRequestDTO;
import com.web.equipe5.manutencaoequipamentos.dto.request.CategoriaEquipamentoUpdateRequestDTO;
import com.web.equipe5.manutencaoequipamentos.dto.response.CategoriaEquipamentoResponseDTO;
import com.web.equipe5.manutencaoequipamentos.mapper.CategoriaEquipamentoMapper;
import com.web.equipe5.manutencaoequipamentos.model.CategoriaEquipamento;
import com.web.equipe5.manutencaoequipamentos.service.CategoriaEquipamentoService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;
import java.util.List;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaEquipamentoController {

    private final CategoriaEquipamentoService service;

    public CategoriaEquipamentoController(CategoriaEquipamentoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Page<CategoriaEquipamentoResponseDTO>> listarTodas(Pageable pageable) {
        Page<CategoriaEquipamento> categorias = service.listarTodas(pageable);
        Page<CategoriaEquipamentoResponseDTO> response = categorias.map(CategoriaEquipamentoMapper::toDTO);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/ativas")
    public ResponseEntity<List<CategoriaEquipamentoResponseDTO>> listarAtivas() {
        List<CategoriaEquipamento> categorias = service.listarAtivas();

        List<CategoriaEquipamentoResponseDTO> response = categorias.stream()
            .map(CategoriaEquipamentoMapper::toDTO)
            .collect(Collectors.toList());

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaEquipamentoResponseDTO> buscarPorId(@PathVariable Long id) {
        CategoriaEquipamento categoria = service.buscarPorId(id);
        return ResponseEntity.status(HttpStatus.OK).body(CategoriaEquipamentoMapper.toDTO(categoria));
    }
    
    @PostMapping
    public ResponseEntity<CategoriaEquipamentoResponseDTO> criar(
        @Valid @RequestBody CategoriaEquipamentoRequestDTO requisicao) {
        CategoriaEquipamento novaCategoria = service.salvar(requisicao);
        return ResponseEntity.status(HttpStatus.CREATED).body(CategoriaEquipamentoMapper.toDTO(novaCategoria));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<CategoriaEquipamentoResponseDTO> atualizar(
            @PathVariable Long id, 
            @Valid @RequestBody CategoriaEquipamentoUpdateRequestDTO requisicao) {
        CategoriaEquipamento categoriaAtualizada = service.atualizar(id, requisicao);
        return ResponseEntity.status(HttpStatus.OK).body(CategoriaEquipamentoMapper.toDTO(categoriaAtualizada));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<CategoriaEquipamentoResponseDTO> deletar(@PathVariable Long id) {
        CategoriaEquipamento categoriaDeletada = service.deletar(id);
        return ResponseEntity.status(HttpStatus.OK).body(CategoriaEquipamentoMapper.toDTO(categoriaDeletada));
    }
}
