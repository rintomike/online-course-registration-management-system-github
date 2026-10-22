package com.coursereg.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/*
 * Central CORS setup. Because the frontend (plain HTML/CSS/JS) is served from a
 * different origin than this API (e.g. a Live Server on :5500, this API on :8080),
 * the browser blocks fetch() calls unless the server explicitly allows that origin.
 *
 * This applies to every @RestController below - no need to add @CrossOrigin per class.
 * Prefer a specific origin over "*" so cookies/auth headers can be used later if needed.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${app.cors.allowed-origin}")
    private String allowedOrigin;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/")
                .allowedOrigins(allowedOrigin)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}
