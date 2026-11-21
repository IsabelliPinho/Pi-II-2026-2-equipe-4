package com.gabicake.api.security;

import java.util.List;
import java.util.Set;

import org.springframework.util.AntPathMatcher;

/**
 * Matriz de Autorização (docs/Matriz de Autorização.pdf) em forma de tabela.
 * Regra de ouro: a primeira linha que casar com método + caminho decide.
 * Rota que não casa com nenhuma linha exige apenas estar autenticado.
 */
public final class RegrasDeAcesso {

    private static final Set<String> TODOS = Set.of(Perfis.GERENTE, Perfis.FUNCIONARIO);
    private static final Set<String> SO_GERENTE = Set.of(Perfis.GERENTE);

    private record Regra(String metodo, String padrao, Set<String> perfisPermitidos) {
    }

    private static final AntPathMatcher MATCHER = new AntPathMatcher();

    private static final List<Regra> REGRAS = List.of(
            // R001..R010 da matriz
            new Regra("POST", "/clientes/cadastro", TODOS),
            new Regra("GET", "/clientes/busca", TODOS),
            new Regra("POST", "/pedidos/cadastro", TODOS),
            new Regra("GET", "/pedidos/consulta", TODOS),
            // PATCH: funcionário pode alterar/marcar atendido; cancelar é só gerente (checado no controller)
            new Regra("PATCH", "/pedidos/{id}", TODOS),
            new Regra("GET", "/pedidos/{id}", TODOS),
            new Regra("GET", "/agenda", TODOS),
            new Regra("GET", "/lembretes/pedidos-proximos", TODOS),
            new Regra("GET", "/financeiro/acesso", SO_GERENTE),
            new Regra("GET", "/listar/produtos", TODOS),
            // Fora da matriz (decisão da equipe a confirmar): login obrigatório
            new Regra("POST", "/verificar/entrega", TODOS),
            new Regra("POST", "/usuarios/cadastro", SO_GERENTE),
            new Regra("POST", "/auth/logout", TODOS)
    );

    private RegrasDeAcesso() {
    }

    /** Perfis que podem usar a rota; conjunto vazio de "regra" = qualquer autenticado. */
    public static Set<String> perfisPermitidos(String metodo, String caminho) {
        for (Regra r : REGRAS) {
            if (r.metodo().equalsIgnoreCase(metodo) && MATCHER.match(r.padrao(), caminho)) {
                return r.perfisPermitidos();
            }
        }
        return TODOS;
    }

    public static boolean rotaPublica(String metodo, String caminho) {
        if ("OPTIONS".equalsIgnoreCase(metodo)) {
            return true; // preflight de CORS
        }
        return ("POST".equalsIgnoreCase(metodo) && "/auth/login".equals(caminho))
                || caminho.startsWith("/actuator")
                || caminho.startsWith("/swagger-ui")
                || caminho.startsWith("/v3/api-docs")
                || caminho.equals("/error");
    }
}
