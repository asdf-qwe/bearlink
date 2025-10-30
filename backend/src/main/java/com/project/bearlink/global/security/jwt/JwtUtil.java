package com.project.bearlink.global.security.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;

@Slf4j
@Component
public class JwtUtil {


    @Value("${custom.jwt.secretKey}")
    private String rawSecret;

    private SecretKey secretKey; // 내부 캐싱용


    @PostConstruct
    public void init() {
        this.secretKey = Keys.hmacShaKeyFor(rawSecret.getBytes());
    }


    public static String generateToken(String secret, long expireSeconds, Map<String, Object> claims) {
        Date issuedAt = new Date();
        Date expiration = new Date(issuedAt.getTime() + 1000L * expireSeconds);

        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes());

        return Jwts.builder()
                .claims(claims)
                .issuedAt(issuedAt)
                .expiration(expiration)
                .signWith(key)
                .compact();
    }


    public static boolean isValid(String secret, String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(secret.getBytes());
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parse(token);
            return true;
        } catch (Exception e) {
            log.warn("Invalid JWT token: {}", e.getMessage());
            return false;
        }
    }


    @SuppressWarnings("unchecked")
    public static Map<String, Object> getPayload(String secret, String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(secret.getBytes());
            return (Map<String, Object>) Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parse(token)
                    .getPayload();
        } catch (Exception e) {
            log.warn("Failed to parse JWT token: {}", e.getMessage());
            return null;
        }
    }


    public boolean isValid(String token) {
        try {
            Jwts.parser().verifyWith(secretKey).build().parse(token);
            return true;
        } catch (Exception e) {
            log.warn("Invalid JWT token: {}", e.getMessage());
            return false;
        }
    }


    @SuppressWarnings("unchecked")
    public Map<String, Object> getPayload(String token) {
        try {
            return (Map<String, Object>) Jwts.parser().verifyWith(secretKey).build().parse(token).getPayload();
        } catch (Exception e) {
            log.warn("Failed to parse JWT token: {}", e.getMessage());
            return null;
        }
    }
}
