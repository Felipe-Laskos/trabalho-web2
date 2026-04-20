package com.web.equipe5.manutencaoequipamentos.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender javaMailSender;

    @Value("${app.mail.from}")
    private String from;

    public EmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void enviarSenhaAutocadastro(String destino, String nome, String senhaBruta) {
        SimpleMailMessage mensagem = new SimpleMailMessage();

        mensagem.setFrom(from);
        mensagem.setTo(destino);
        mensagem.setSubject("Senha de Acesso - Manutenção de Equipamento Equipe 5");
        mensagem.setText(
            "Olá, " + nome + "!\n\n" +
            "Seu cadastro foi criado com sucesso!\n" +
            "Sua senha de acesso é: " + senhaBruta + "\n\n" +
            "Para fazer login, utilize seu email e senha."
        );

        javaMailSender.send(mensagem);
    }
}
