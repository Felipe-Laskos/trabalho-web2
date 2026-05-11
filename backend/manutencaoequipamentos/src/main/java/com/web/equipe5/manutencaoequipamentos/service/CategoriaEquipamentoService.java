package com.web.equipe5.manutencaoequipamentos.service;

import com.web.equipe5.manutencaoequipamentos.model.CategoriaEquipamento;
import com.web.equipe5.manutencaoequipamentos.repository.CategoriaRepository;
import com.web.equipe5.manutencaoequipamentos.exception.ResourceNotFoundException;
import com.web.equipe5.manutencaoequipamentos.exception.BusinessRuleException;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.List;

@Service
public class CategoriaEquipamentoService {
    private final CategoriaRepository repository;

    public CategoriaEquipamentoService(CategoriaRepository repository) {
        this.repository = repository;
    } 

    public List<CategoriaEquipamento> listarAtivas() {
        return repository.findByAtivoTrue();
    }

    public CategoriaEquipamento salvar(CategoriaEquipamento categoria) {
        if (categoria.getNome() == null || categoria.getNome().trim().isEmpty()) {
            throw new BusinessRuleException("Nome da categoria é obrigatório");
        }
        
        if (categoria.getAtivo() == null) {
            categoria.setAtivo(true);
        }
        
        return repository.save(categoria);
    }

    public CategoriaEquipamento atualizar(Long id, Map<String, Object> campos) {
        CategoriaEquipamento categoriaExistente = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada com ID: " + id));
        
        campos.forEach((campo, valor) -> {
            switch (campo) {
                case "nome":
                    categoriaExistente.setNome((String) valor);
                    break;
                case "ativo":
                    categoriaExistente.setAtivo((Boolean) valor);
                    break;
                default:
                    break;
            }
        });
        return repository.save(categoriaExistente);
    }

    public CategoriaEquipamento deletar(Long id) {
        CategoriaEquipamento c = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada")); 
            
            c.setAtivo(false);
            return repository.save(c);
    }
}