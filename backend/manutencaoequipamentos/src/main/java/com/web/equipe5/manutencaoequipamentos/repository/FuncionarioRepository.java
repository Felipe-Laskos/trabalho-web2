package com.web.equipe5.manutencaoequipamentos.repository;

import com.web.equipe5.manutencaoequipamentos.model.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {

    Page<Funcionario> findByAtivoTrue(Pageable pageable);
    Page<Funcionario> findByAtivoFalse(Pageable pageable);

    List<Funcionario> findAll();
    Optional<Funcionario> findByEmail(String email);
    Optional<Funcionario> findByCpf(String cpf);

    boolean existsByCpf(String cpf);
    
    boolean existsByEmail(String email);

    long countByAtivoTrue(); 

}