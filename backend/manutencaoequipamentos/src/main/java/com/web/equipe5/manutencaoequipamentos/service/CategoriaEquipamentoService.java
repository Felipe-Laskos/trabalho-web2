package com.web.equipe5.manutencaoequipamentos.service;

import com.web.equipe5.manutencaoequipamentos.dto.request.CategoriaEquipamentoRequestDTO;
import com.web.equipe5.manutencaoequipamentos.dto.request.CategoriaEquipamentoUpdateRequestDTO;
import com.web.equipe5.manutencaoequipamentos.mapper.CategoriaEquipamentoMapper;
import com.web.equipe5.manutencaoequipamentos.model.CategoriaEquipamento;
import com.web.equipe5.manutencaoequipamentos.repository.CategoriaRepository;
import com.web.equipe5.manutencaoequipamentos.exception.ResourceNotFoundException;
import com.web.equipe5.manutencaoequipamentos.exception.BusinessRuleException;

import org.springframework.stereotype.Service;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

@Service
public class CategoriaEquipamentoService {
    private final CategoriaRepository repository;

    public CategoriaEquipamentoService(CategoriaRepository repository) {
        this.repository = repository;
    } 

    public Page<CategoriaEquipamento> listarTodas(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public Page<CategoriaEquipamento> listarAtivas(Pageable pageable) {
        return repository.findByAtivoTrue(pageable);
    }

    public Page<CategoriaEquipamento> listarInativas(Pageable pageable) {
        return repository.findByAtivoFalse(pageable);
    }

    public CategoriaEquipamento buscarPorId(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada com ID: " + id));
    }

    public CategoriaEquipamento salvar(CategoriaEquipamentoRequestDTO requisicao) {
        if (requisicao.nome() == null || requisicao.nome().trim().isEmpty()) {
            throw new BusinessRuleException("Nome da categoria é obrigatório");
        }

        List<CategoriaEquipamento> existentes = repository.findByNomeIgnoreCase(requisicao.nome().trim());

        if (!existentes.isEmpty()) {

            boolean possuiInativa =
                existentes.stream()
                        .anyMatch(c ->
                            Boolean.FALSE.equals(c.getAtivo())
                        );

            if (possuiInativa) {
                throw new BusinessRuleException(
                    "Já existe uma categoria inativa com esse nome. Reative-a."
                );
            }

            throw new BusinessRuleException(
                "Já existe uma categoria com esse nome."
            );
        }

        CategoriaEquipamento categoria = CategoriaEquipamentoMapper.toEntity(requisicao);
        if (categoria.getAtivo() == null) {
            categoria.setAtivo(true);
        }
        
        try {
            return repository.save(categoria);
        }
        catch (DataIntegrityViolationException e) {
            throw new BusinessRuleException(
                "Já existe uma categoria com esse nome."
            );
        }
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

    public CategoriaEquipamento reativar(Long id) {
        CategoriaEquipamento categoria =
            repository.findById(id)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Categoria não encontrada"
                )
            );

        if (Boolean.TRUE.equals(categoria.getAtivo())) {
            throw new BusinessRuleException(
                "Categoria já está ativa."
            );
        }

        categoria.setAtivo(true);

        return repository.save(categoria);
    }
}
