/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.gabicake.api.controller;

/**
 *
 * @author Sanara Carvalho
 */

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/financeiro")
public class FinanceiroController {

    @GetMapping("/acesso")
    public ResponseEntity<Map<String, String>> acessarPlanilha() {
        Map<String, String> resposta = new HashMap<>();
        
        // exemplo próvisorio de url , logo será substituido por um exemplo real de url do google sheets
        resposta.put("url", "https://docs.google.com/spreadsheets/d/EXEMPLO-ID/edit");
        return ResponseEntity.ok(resposta);
    }
}