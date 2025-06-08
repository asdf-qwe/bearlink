package com.project.bearlink.domain.user.auth.service;

import com.project.bearlink.domain.user.auth.dto.JwtResponseDto;
import com.project.bearlink.domain.user.auth.entity.RefreshToken;
import com.project.bearlink.domain.user.auth.repository.RefreshTokenRepository;
import com.project.bearlink.domain.user.user.dto.LoginRequestDto;
import com.project.bearlink.domain.user.user.entity.User;
import com.project.bearlink.domain.user.user.repository.UserRepository;
import com.project.bearlink.global.security.jwt.JwtTokenProvider;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;

@RequiredArgsConstructor
@Service
public class authService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;
//    public JwtResponseDto login(LoginRequestDto dto) {
//        User user = userRepository.findByEmail(dto.getEmail())
//                .orElseThrow(() -> new IllegalArgumentException("잘못된 이메일 또는 비밀번호"));
//
//        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
//            throw new IllegalArgumentException("잘못된 이메일 또는 비밀번호");
//        }
//
//        String accessToken = jwtTokenProvider.generateAccessToken(user.getEmail());
//        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());
//
//        return JwtResponseDto.builder()
//                .accessToken(accessToken)
//                .refreshToken(refreshToken)
//                .build();
//    }
    public JwtResponseDto login(LoginRequestDto dto, HttpServletResponse response) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(()-> new IllegalArgumentException("잘못된 이메일"));
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("잘못된 비밀번호");
        }

        String accessToken = jwtTokenProvider.generateAccessToken(user.getEmail());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());

        RefreshToken entity = new RefreshToken(user.getEmail(), refreshToken);
        refreshTokenRepository.save(entity);

        Cookie cookie = new Cookie("refreshToken", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(7*24*60*60);
        response.addCookie(cookie);

        return JwtResponseDto.builder()
                .accessToken(accessToken)
                .build();
    }

}
