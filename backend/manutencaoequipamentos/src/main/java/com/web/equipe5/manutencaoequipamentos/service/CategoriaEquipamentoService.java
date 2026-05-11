package com.web.equipe5.manutencaoequipamentos.service;

import com.web.equipe5.manutencaoequipamentos.dto.request.CategoriaEquipamentoRequestDTO;
import com.web.equipe5.manutencaoequipamentos.dto.request.CategoriaEquipamentoUpdateRequestDTO;
import com.web.equipe5.manutencaoequipamentos.mapper.CategoriaEquipamentoMapper;
import com.web.equipe5.manutencaoequipamentos.model.CategoriaEquipamento;
import com.web.equipe5.manutencaoequipamentos.repository.CategoriaRepository;
import com.web.equipe5.manutencaoequipamentos.exception.ResourceNotFoundException;
import com.web.equipe5.manutencaoequipamentos.exception.BusinessRuleException;

import org.springframework.stereotype.Service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class CategoriaEquipamentoService {
    private final CategoriaRepository repository;

    public CategoriaEquipamentoService(CategoriaRepository repository) {
        this.repository = repository;
    } 

    public Page<CategoriaEquipamento> listarTodas(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public List<CategoriaEquipamento> listarAtivas() {
        return repository.findByAtivoTrue();
    }

    public CategoriaEquipamento buscarPorId(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada com ID: " + id));
    }

    public CategoriaEquipamento salvar(CategoriaEquipamentoRequestDTO requisicao) {
        if (requisicao.nome() == null || requisicao.nome().trim().isEmpty()) {
            throw new BusinessRuleException("Nome da categoria é obrigatório");
        }

        CategoriaEquipamento categoria = CategoriaEquipamentoMapper.toEntity(requisicao);
        if (categoria.getAtivo() == null) {
            categoria.setAtivo(true);
        }
        
        return repository.save(categoria);
    }

    public CategoriaEquipamento atualizar(Long id, CategoriaEquipamentoUpdateRequestDTO requisicao) {
        CategoriaEquipamento categoriaExistente = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada com ID: " + id));

        if (requisicao.nome() != null) {
            categoriaExistente.setNome(requisicao.nome());
        }
        if (requisicao.ativo() != null) {
            categoriaExistente.setAtivo(requisicao.ativo());
        }

        return repository.save(categoriaExistente);
    }

    public CategoriaEquipamento deletar(Long id) {
        CategoriaEquipamento c = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada")); 
            
            c.setAtivo(false);
            return repository.save(c);
    }
}
