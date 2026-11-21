package com.gabicake.api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.gabicake.api.security.AuthInterceptor;
import com.gabicake.api.service.SessaoService;

@Configuration
public class AuthConfig implements WebMvcConfigurer {

    private final SessaoService sessaoService;
    // Chave de transição: APP_AUTH_ENABLED=false desliga a checagem (só enquanto o front não usa o login real).
    private final boolean habilitada;

    public AuthConfig(SessaoService sessaoService,
                      @Value("${app.auth.enabled:true}") boolean habilitada) {
        this.sessaoService = sessaoService;
        this.habilitada = habilitada;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        if (habilitada) {
            registry.addInterceptor(new AuthInterceptor(sessaoService));
        }
    }
}
