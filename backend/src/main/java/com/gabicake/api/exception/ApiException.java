/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.gabicake.api.exception;

/**
 *
 * @author Sanara Carvalho
 */

import org.springframework.http.HttpStatus;

/**
*classe de exceção base para o dominio da aplicação.
*tem como prposito encapsular as violações de regras de negócio,
* mapeando-as rigorosamente para a semântica dos códigos de estudo HTTP ( como : 400,404 e 402).
 */

public class ApiException extends RuntimeException {

    private final HttpStatus status;
    private final String codigo;

    public ApiException(HttpStatus status, String codigo, String message) {
        super(message);
        this.status = status;
        this.codigo = codigo;
    }

    public static ApiException validacao(String message) {
        return new ApiException(HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", message);
    }

    public static ApiException naoEncontrado(String message) {
        return new ApiException(HttpStatus.NOT_FOUND, "NOT_FOUND", message);
    }

    public static ApiException conflito(String message) {
        return new ApiException(HttpStatus.CONFLICT, "BUSINESS_RULE_VIOLATION", message);
    }

    public static ApiException duplicado(String message) {
        return new ApiException(HttpStatus.CONFLICT, "DUPLICATE_CLIENT", message);
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getCodigo() {
        return codigo;
    }
}
