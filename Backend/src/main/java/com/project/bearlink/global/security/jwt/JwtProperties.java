package com.project.bearlink.global.security.jwt;

import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "custom.jwt")
@Getter
@Setter
public class JwtProperties {
    private String secretKey;
    private TokenExpiration accessToken;
    private TokenExpiration refreshToken;

    @Getter
    @Setter
    public static class TokenExpiration {
        private long expirationSeconds;
    }

    @PostConstruct
    public void printDebug() {
        System.out.println("=== JWT 설정 확인 ===");
        System.out.println("secretKey = " + secretKey);
        System.out.println("accessToken = " + (accessToken == null ? "null" : accessToken.getExpirationSeconds()));
        System.out.println("refreshToken = " + (refreshToken == null ? "null" : refreshToken.getExpirationSeconds()));
    }

}
