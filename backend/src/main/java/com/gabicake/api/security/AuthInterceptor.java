package com.gabicake.api.security;

import java.util.Optional;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.HandlerInterceptor;

import com.gabicake.api.exception.ApiException;
import com.gabicake.api.service.SessaoService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * 401: sem token, token inválido, expirado ou revogado.
 * 403: autenticado, mas o perfil não tem permissão (Matriz de Autorização).
 * As exceções são convertidas em JSON pelo GlobalExceptionHandler.
 */
public class AuthInterceptor implements HandlerInterceptor {

    public static final String ATRIBUTO_USUARIO = "usuarioAutenticado";

    private final SessaoService sessaoService;

    public AuthInterceptor(SessaoService sessaoService) {
        this.sessaoService = sessaoService;
    }

    @Override
    public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object handler) {
        String metodo = req.getMethod();
        String caminho = req.getRequestURI();

        if (RegrasDeAcesso.rotaPublica(metodo, caminho)) {
            return true;
        }

        Optional<UsuarioAutenticado> usuario = sessaoService.validar(extrairToken(req));
        if (usuario.isEmpty()) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED",
                    "Sessão ausente, inválida ou expirada. Faça login novamente.");
        }

        Set<String> permitidos = RegrasDeAcesso.perfisPermitidos(metodo, caminho);
        if (permitidos.stream().noneMatch(usuario.get()::temPerfil)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "FORBIDDEN",
                    "Seu perfil não tem permissão para esta ação.");
        }

        req.setAttribute(ATRIBUTO_USUARIO, usuario.get());
        return true;
    }

    private String extrairToken(HttpServletRequest req) {
        String h = req.getHeader("Authorization");
        if (h != null && h.regionMatches(true, 0, "Bearer ", 0, 7)) {
            return h.substring(7).trim();
        }
        return null;
    }
}
