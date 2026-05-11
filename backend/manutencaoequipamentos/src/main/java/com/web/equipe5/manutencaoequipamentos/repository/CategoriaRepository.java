package com.web.equipe5.manutencaoequipamentos.repository;

import com.web.equipe5.manutencaoequipamentos.model.CategoriaEquipamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CategoriaRepository extends JpaRepository<CategoriaEquipamento, Long> {

    List<CategoriaEquipamento> findByAtivoTrue();

}