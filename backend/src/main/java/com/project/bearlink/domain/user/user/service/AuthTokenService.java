package com.project.bearlink.domain.user.user.service;

import com.project.bearlink.domain.user.user.entity.User;
import com.project.bearlink.domain.user.user.entity.UserRole;
import com.project.bearlink.global.security.jwt.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
public class AuthTokenService {

    @Value("${custom.jwt.secretKey}")
    private String jwtSecret;

    @Value("${custom.accessToken.expirationSeconds}")
    private long accessTokenExpirationSeconds;

    @Value("${custom.refreshToken.expirationSeconds}")
    private long refreshTokenExpirationSeconds;


    public String genAccessToken(User user) {
        long id = user.getId();
        String email = user.getEmail();
        String nickname = user.getNickname();
        UserRole role = user.getRole();
        return JwtUtil.generateToken(
                jwtSecret,
                accessTokenExpirationSeconds,
                Map.of("userId", id, "email", email, "nickname", nickname, "role", role)
        );
    }


    public String genRefreshToken(User user) {
        long id = user.getId();
        String email = user.getEmail();

        return JwtUtil.generateToken(
                jwtSecret,
                refreshTokenExpirationSeconds,
                Map.of("userId", id, "email", email)
        );
    }

    public String genRefreshTokenByEmail(String email) {

        return JwtUtil.generateToken(
                jwtSecret,
                refreshTokenExpirationSeconds,
                Map.of("email", email)
        );
    }


    public Map<String, Object> payload(String token) {
        log.info("jwtSecret from AuthTokenService: {}", jwtSecret);
        return JwtUtil.getPayload(jwtSecret, token);
    }


    public boolean isValid(String token) {
        log.info("isValid() - jwtSecret: {}", jwtSecret);
        return JwtUtil.isValid(jwtSecret, token);
    }
}