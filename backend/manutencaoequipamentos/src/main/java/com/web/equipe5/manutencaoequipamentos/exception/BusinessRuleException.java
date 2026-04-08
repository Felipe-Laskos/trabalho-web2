package com.web.equipe5.manutencaoequipamentos.exception;

public class BusinessRuleException extends RuntimeException{
    public BusinessRuleException(String mensagem) {
        super(mensagem);
    }
}
