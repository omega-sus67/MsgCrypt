package com.ttlVault.secretShare.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                // Lock this down. NEVER use "*" in a production security tool.
                .allowedOrigins("http://localhost:3000") // The default Vite/Create-React-App port
                .allowedMethods("GET", "POST") // We only need to seal (POST) and read (GET)
                .allowedHeaders("*"); // Allow all headers (like Content-Type: application/json)
    }
}