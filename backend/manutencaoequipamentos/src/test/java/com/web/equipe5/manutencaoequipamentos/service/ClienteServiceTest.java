package com.web.equipe5.manutencaoequipamentos.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.web.equipe5.manutencaoequipamentos.dto.ClientePatchDTO;
import com.web.equipe5.manutencaoequipamentos.repository.ClienteRepository;
import com.web.equipe5.manutencaoequipamentos.model.Cliente;
import com.web.equipe5.manutencaoequipamentos.exception.BusinessRuleException;
import com.web.equipe5.manutencaoequipamentos.exception.ResourceNotFoundException;

@ExtendWith(MockitoExtension.class)
public class ClienteServiceTest {

    @Mock
    private ClienteRepository repository;

    @Mock
    private HashService hashService;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private ClienteService service;

@Test
void deveBuscarClientePorId() {

    Cliente cliente = new Cliente();

    cliente.setId(1L);
    cliente.setNome("Pedro");

    when(repository.findById(1L)) 
            .thenReturn(Optional.of(cliente));

    Cliente resultado = service.buscarPorId(1L);

    assertThat(resultado.getId()).isEqualTo(1L);
    assertThat(resultado.getNome()).isEqualTo("Pedro");
}

@Test
void deveLancarUmErroQuandoClienteNaoExistir() {

    when(repository.findById(99L))
            .thenReturn(Optional.empty());

    assertThatThrownBy(
            () -> service.buscarPorId(99L))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessageContaining("99");
}
 
@Test
void deveLancarUmErroQuandoEmailJaEstiverEmUsoPorOutroCliente() {

    Cliente clienteAtual = new Cliente();

    clienteAtual.setId(1L);
    clienteAtual.setEmail("antigo@email.com");

    Cliente outroCliente = new Cliente();

    outroCliente.setId(2L);
    outroCliente.setEmail("novo@email.com");

    ClientePatchDTO patch = new ClientePatchDTO(
            null,
            "novo@email.com",
            null,
            null,
            null,
            null
    );

    when(repository.findById(1L))
            .thenReturn(Optional.of(clienteAtual));

    when(repository.existsByEmail("novo@email.com"))
            .thenReturn(true);

    when(repository.findByEmail("novo@email.com"))
            .thenReturn(Optional.of(outroCliente));

    assertThatThrownBy(
            () -> service.atualizar(1L, patch))
            .isInstanceOf(BusinessRuleException.class)
            .hasMessageContaining("Email");
}

@Test
void deveAtualizarNomeCliente() {

    Cliente cliente = new Cliente();

    cliente.setId(1L);
    cliente.setNome("Nome Antigo");

    ClientePatchDTO patch = new ClientePatchDTO(
            "Novo Nome",
            null,
            null,
            null,
            null,
            null
    );

    when(repository.findById(1L))
            .thenReturn(Optional.of(cliente));

    when(repository.save(any()))
            .thenAnswer(invocation -> invocation.getArgument(0));

    Cliente atualizado =
            service.atualizar(1L, patch);

    assertThat(atualizado.getNome())
            .isEqualTo("Novo Nome");
}

@Test
void deveAtualizarSenhaEGerarNovoHash() {

    Cliente cliente = new Cliente();

    cliente.setId(1L);

    ClientePatchDTO patch = new ClientePatchDTO(
            null,
            null,
            null,
            null,
            null,
            "1234"
    );

    when(repository.findById(1L))
            .thenReturn(Optional.of(cliente));

    when(hashService.gerarSaltHex())
            .thenReturn("SALT");

    when(hashService.sha256Hex("1234", "SALT"))
            .thenReturn("HASH");

    when(repository.save(any()))
            .thenAnswer(invocation -> invocation.getArgument(0));

    Cliente atualizado =
            service.atualizar(1L, patch);

    assertThat(atualizado.getSalt())
            .isEqualTo("SALT");

    assertThat(atualizado.getSenha())
            .isEqualTo("HASH");
}

@Test
void deveRealizarUmSoftDelete() {

    Cliente cliente = new Cliente();

    cliente.setId(1L);
    cliente.setAtivo(true);

    when(repository.findById(1L))
            .thenReturn(Optional.of(cliente)); 

    when(repository.countByAtivoTrue())
            .thenReturn(2L);

    when(repository.save(any()))
            .thenAnswer(invocation -> invocation.getArgument(0));

    Cliente resultado =
            service.deletar(1L, 1L);

    assertThat(resultado.getAtivo())
            .isFalse();
}

@Test
void deveLancarUmErroQuandoForUltimoClienteAtivo() {

    Cliente cliente = new Cliente();

    cliente.setId(1L);
    cliente.setAtivo(true);

    when(repository.findById(1L))
            .thenReturn(Optional.of(cliente));

    when(repository.countByAtivoTrue())
            .thenReturn(1L);

    assertThatThrownBy(
            () -> service.deletar(1L, 1L))
            .isInstanceOf(BusinessRuleException.class)
            .hasMessageContaining("único");
}
}


