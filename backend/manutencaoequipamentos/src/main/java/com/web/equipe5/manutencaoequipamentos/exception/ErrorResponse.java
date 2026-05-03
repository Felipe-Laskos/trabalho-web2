package com.web.equipe5.manutencaoequipamentos.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDateTime;
import java.util.Map;

//incluido, pois ignora campos nulos, assim o JSON fica limpo quando não for erro de validação
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorResponse(
        int status,
        String erro,
        String mensagem,
        LocalDateTime timestamp,
        Map<String, String> erros
) {
    public ErrorResponse(int status, String erro, String mensagem) {
        this(status, erro, mensagem, LocalDateTime.now(), null);
    }

    // Utilizado quando há necessidade de devolver a lista dos campos que falharam na validação.
    public ErrorResponse(int status, String erro, String mensagem, Map<String, String> erros) {
        this(status, erro, mensagem, LocalDateTime.now(), erros);
    }
}