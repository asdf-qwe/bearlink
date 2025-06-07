package com.project.bearlink.global.security.jwt;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.awt.*;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

    private final JwtProperties jwtProperties;

    public String generateAccessToken(String email) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("sub", email);
        return generateToken(claims, jwtProperties.getAccessToken().getExpirationSeconds());
    }

    public String generateRefreshToken(String email) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("sub", email);
        return generateToken(claims, jwtProperties.getRefreshToken().getExpirationSeconds());
    }

    private String generateToken(Map<String, Object> claims, long expirationSeconds) {
        Date issuedAt = new Date();
        Date expiration = new Date(issuedAt.getTime() + expirationSeconds * 1000L);

        SecretKey key = Keys.hmacShaKeyFor(jwtProperties.getSecretKey().getBytes());

        return Jwts.builder()
                .claims(claims)
                .issuedAt(issuedAt)
                .expiration(expiration)
                .signWith(key)
                .compact();
    }

    public String getEmailFromToken(String token) {
        SecretKey key = Keys.hmacShaKeyFor(jwtProperties.getSecretKey().getBytes());

        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject(); // "sub" 클레임 값 반환
    }

    public boolean validateToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtProperties.getSecretKey().getBytes());
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

}
