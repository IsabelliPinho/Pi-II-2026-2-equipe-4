/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.gabicake.api.exception;

/**
 *
 * @author Sanara Carvalho
 */


/** 
 * Adicionei o Formato padrão de erro devolvido pela API:
 * { "error": "VALIDATION_ERROR", "message": "..." }
 */

public class ErrorResponse {

    private final String error;
    private final String message;

    public ErrorResponse(String error, String message) {
        this.error = error;
        this.message = message;
    }

    public String getError() {
        return error;
    }

    public String getMessage() {
        return message;
    }
}
