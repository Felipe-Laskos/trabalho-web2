package com.web.equipe5.manutencaoequipamentos.repository;

import com.web.equipe5.manutencaoequipamentos.model.CategoriaEquipamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface CategoriaRepository extends JpaRepository<CategoriaEquipamento, Long> {
    Page<CategoriaEquipamento> findByAtivoTrue(Pageable pageable);
    boolean existsByNomeIgnoreCase(String nome);
}