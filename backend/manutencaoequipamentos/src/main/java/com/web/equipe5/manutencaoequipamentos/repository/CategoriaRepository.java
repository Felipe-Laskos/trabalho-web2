package com.web.equipe5.manutencaoequipamentos.repository;

import com.web.equipe5.manutencaoequipamentos.model.CategoriaEquipamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface CategoriaRepository extends JpaRepository<CategoriaEquipamento, Long> {
    Page<CategoriaEquipamento> findByAtivoTrue(Pageable pageable);
    Page<CategoriaEquipamento> findByAtivoFalse(Pageable pageable);
    Page<CategoriaEquipamento> findByNomeContainingIgnoreCase(String nome, Pageable pageable);
    Page<CategoriaEquipamento> findByAtivoTrueAndNomeContainingIgnoreCase(String nome, Pageable pageable);
    Page<CategoriaEquipamento> findByAtivoFalseAndNomeContainingIgnoreCase(String nome, Pageable pageable);

    List<CategoriaEquipamento>findByNomeIgnoreCase(String nome);
}
