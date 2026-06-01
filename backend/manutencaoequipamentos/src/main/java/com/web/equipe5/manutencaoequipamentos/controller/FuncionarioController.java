package com.web.equipe5.manutencaoequipamentos.controller;

import com.web.equipe5.manutencaoequipamentos.dto.request.FuncionarioRequestDTO;
import com.web.equipe5.manutencaoequipamentos.dto.request.FuncionarioUpdateRequestDTO;
import com.web.equipe5.manutencaoequipamentos.dto.response.FuncionarioResponseDTO;
import com.web.equipe5.manutencaoequipamentos.model.Funcionario;
import com.web.equipe5.manutencaoequipamentos.service.FuncionarioService;

import jakarta.validation.Valid;

import com.web.equipe5.manutencaoequipamentos.mapper.FuncionarioMapper;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;

import com.web.equipe5.manutencaoequipamentos.config.JwtAuthenticationFilter;

@RestController
@RequestMapping("/api/funcionarios")
public class FuncionarioController {

    private final FuncionarioService service;

    public FuncionarioController(FuncionarioService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Page<FuncionarioResponseDTO>> listar(
        @RequestParam(required = false) String termo,
        @PageableDefault(size = 10, sort = "nome") Pageable pageable) {
        Page<Funcionario> lista = service.listarTodos(termo, pageable);
        Page<FuncionarioResponseDTO> response = lista.map(FuncionarioMapper::toDTO);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/ativos")
    public ResponseEntity<Page<FuncionarioResponseDTO>> listarAtivos(
        @RequestParam(required = false) String termo,
        @PageableDefault(size = 10, sort = "nome") Pageable pageable) {
        Page<Funcionario> lista = service.listarAtivos(termo, pageable);
        Page<FuncionarioResponseDTO> response = lista.map(FuncionarioMapper::toDTO);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/inativos")
    public ResponseEntity<Page<FuncionarioResponseDTO>> listarInativos(
        @RequestParam(required = false) String termo,
        @PageableDefault(size = 10, sort = "nome") Pageable pageable) {
        Page<Funcionario> lista = service.listarInativos(termo, pageable);
        Page<FuncionarioResponseDTO> response = lista.map(FuncionarioMapper::toDTO);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FuncionarioResponseDTO> buscarPorId(@PathVariable Long id) {
        Funcionario fun = service.buscarPorId(id);  
        return ResponseEntity.status(HttpStatus.OK).body(FuncionarioMapper.toDTO(fun));
    }
    
    @GetMapping("/email/{email}")
    public ResponseEntity<FuncionarioResponseDTO> buscarPorEmail(@PathVariable String email) {
        Funcionario fun = service.buscarPorEmail(email);  
        return ResponseEntity.status(HttpStatus.OK).body(FuncionarioMapper.toDTO(fun));
    }

    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<FuncionarioResponseDTO> buscarPorCpf(@PathVariable String cpf) {
        Funcionario fun = service.buscarPorCpf(cpf); 
        return ResponseEntity.status(HttpStatus.OK).body(FuncionarioMapper.toDTO(fun));
    }

    @PostMapping
    public ResponseEntity<FuncionarioResponseDTO> criar(@Valid @RequestBody FuncionarioRequestDTO requisicao) {
        FuncionarioResponseDTO novoFuncionario = service.salvar(requisicao);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoFuncionario);
    }
    
    @PatchMapping("/{id}")  
    public ResponseEntity<FuncionarioResponseDTO> atualizarParcial(
            @PathVariable Long id, 
            @Valid @RequestBody FuncionarioUpdateRequestDTO requisicao) {
        Funcionario funcionarioAtualizado = service.atualizar(id, requisicao);
        return ResponseEntity.status(HttpStatus.OK).body(FuncionarioMapper.toDTO(funcionarioAtualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<FuncionarioResponseDTO> deletar(
        @PathVariable Long id, 
        @AuthenticationPrincipal JwtAuthenticationFilter.AuthenticatedPrincipal usuarioLogado) {
        Funcionario fun = service.deletar(id, usuarioLogado.id());  
        return ResponseEntity.status(HttpStatus.OK).body(FuncionarioMapper.toDTO(fun));
    }

    @PatchMapping("/{id}/reativar")
    public ResponseEntity<FuncionarioResponseDTO> reativar(@PathVariable Long id){
        Funcionario funcionario = service.reativar(id);
        return ResponseEntity.status(HttpStatus.OK).body(FuncionarioMapper.toDTO(funcionario));
    }
}
