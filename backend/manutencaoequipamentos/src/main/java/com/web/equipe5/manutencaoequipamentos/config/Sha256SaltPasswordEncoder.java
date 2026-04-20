package com.web.equipe5.manutencaoequipamentos.config;

import java.security.MessageDigest;

import org.springframework.security.crypto.password.PasswordEncoder;

import com.web.equipe5.manutencaoequipamentos.service.HashService;

public class Sha256SaltPasswordEncoder implements PasswordEncoder {

    private final HashService hashService;

    public Sha256SaltPasswordEncoder(HashService hashService) {
        this.hashService = hashService;
    }

    @Override
    public String encode(CharSequence raw) {
        String salt = hashService.gerarSaltHex();
        String hash = hashService.sha256Hex(raw.toString(), salt);
        return salt + ":" + hash;
    }

    @Override
    public boolean matches(CharSequence raw, String stored) {
        if(stored == null || !stored.contains(":")) {
            return false;
        }

        String[] parts = stored.split(":", 2);

        String salt = parts[0];
        String expected = parts[1];

        String calc = hashService.sha256Hex(raw.toString(), salt);

        return MessageDigest.isEqual(expected.getBytes(), calc.getBytes());
    }
    
}
