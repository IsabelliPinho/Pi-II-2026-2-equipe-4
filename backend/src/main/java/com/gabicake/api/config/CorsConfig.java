package com.gabicake.api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS configuravel por ambiente.
 * APP_CORS_ORIGINS: origens permitidas separadas por virgula
 * (ex.: https://gabicake.vercel.app,https://gabicake-front.onrender.com).
 * Sem a variavel, aceita qualquer origem (uso local/desenvolvimento).
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    private final String[] origens;

    public CorsConfig(@Value("${app.cors.origins:*}") String origens) {
        this.origens = origens.trim().split("\\s*,\\s*");
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns(origens)
                .allowedMethods("GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}
