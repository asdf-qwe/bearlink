package com.project.bearlink.domain.user.auth.controller;

import com.project.bearlink.domain.user.auth.entity.RefreshToken;
import com.project.bearlink.domain.user.auth.repository.RefreshTokenRepository;
import com.project.bearlink.domain.user.auth.service.authService;
import com.project.bearlink.domain.user.auth.dto.JwtResponseDto;
import com.project.bearlink.domain.user.user.dto.LoginRequestDto;
import com.project.bearlink.domain.user.user.dto.SignupRequestDto;
import com.project.bearlink.domain.user.user.dto.UserResponseDto;
import com.project.bearlink.domain.user.user.entity.User;
import com.project.bearlink.domain.user.user.service.UserService;
import com.project.bearlink.global.security.auth.CustomUserDetails;
import com.project.bearlink.global.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class authController {
    private final authService authService;
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequestDto dto){
        userService.signup(dto);
        return ResponseEntity.ok("회원가입 성공");
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getCurrentUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userDetails.getUser();
        UserResponseDto responseDto = new UserResponseDto(user);
        return ResponseEntity.ok(responseDto);
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponseDto> login (@RequestBody LoginRequestDto requestDto) {
        JwtResponseDto tokens = authService.login(requestDto);
        return ResponseEntity.ok(tokens);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@CookieValue(value = "refreshToken", required = false)String refreshToken) {
        if (refreshToken == null || !jwtTokenProvider.validateToken(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token invalid");
        }

        String email = jwtTokenProvider.getEmailFromToken(refreshToken);

        RefreshToken storedToken = refreshTokenRepository.findById(email)
                .orElseThrow(()-> new IllegalArgumentException("Refresh token not found"));

        if (!storedToken.getToken().equals(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token mismatch");
        }

        String newAccessToken = jwtTokenProvider.generateAccessToken(email);
        return ResponseEntity.ok(new JwtResponseDto(newAccessToken));
    }
}
