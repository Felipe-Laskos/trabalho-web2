package com.web.equipe5.manutencaoequipamentos.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.web.equipe5.manutencaoequipamentos.dto.request.LoginRequestDTO;
import com.web.equipe5.manutencaoequipamentos.dto.response.LoginResponseDTO;
import com.web.equipe5.manutencaoequipamentos.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO requisicao) {
        return ResponseEntity.ok(authService.login(requisicao));
    }
}
