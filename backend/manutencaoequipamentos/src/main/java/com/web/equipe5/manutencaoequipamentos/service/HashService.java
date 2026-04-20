package com.web.equipe5.manutencaoequipamentos.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;

import org.springframework.stereotype.Service;

@Service
public class HashService {
    private static final SecureRandom aleatorio = new SecureRandom();
    private static final int SALT_BYTES = 16;
    private final int BOUND_VALUE = 10000;

    public String gerarSenha() {
        return String.format("%04d", aleatorio.nextInt(BOUND_VALUE));
    }

    public String gerarSaltHex() {
        byte[] salt = new byte[SALT_BYTES];

        aleatorio.nextBytes(salt);

        return toHex(salt);
    }

    public String sha256Hex(String raw, String saltHex) {
        try {
            MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");
            messageDigest.update(fromHex(saltHex));

            return toHex(messageDigest.digest(raw.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception ex) {
            throw new IllegalStateException("Erro ao tentar usar SHA-256", ex);
        }
    }

    private static String toHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder(bytes.length * 2);

        for (byte b : bytes) sb.append(String.format("%02x", b));
        
        return sb.toString();
    }

    private static byte[] fromHex(String hex) {
        int len = hex.length();
        byte[] out = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            out[i / 2] = (byte) ((Character.digit(hex.charAt(i), 16) << 4)
                               +  Character.digit(hex.charAt(i + 1), 16));
        }
        return out;
    }
}
