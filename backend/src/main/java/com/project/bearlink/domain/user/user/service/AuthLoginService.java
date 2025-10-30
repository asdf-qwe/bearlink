package com.project.bearlink.domain.user.user.service;

import com.project.bearlink.domain.user.user.dto.LoginRequestDto;
import com.project.bearlink.domain.user.user.dto.TokenResponseDto;
import com.project.bearlink.domain.user.user.entity.User;
import com.project.bearlink.domain.user.user.entity.UserRole;
import com.project.bearlink.domain.user.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // 기본은 조회 전용
public class AuthLoginService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthTokenService authTokenService;


    @Transactional(readOnly = false)
    public TokenResponseDto login(LoginRequestDto request) {
        String identifier = request.getLoginId();

        Optional<User> userOptional = identifier.contains("@")
                ? userRepository.findByEmail(identifier)
                : userRepository.findByLoginId(identifier);

        User user = userOptional
                .orElseThrow(() -> new IllegalArgumentException("아이디 또는 비밀번호가 올바르지 않습니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        String accessToken = authTokenService.genAccessToken(user);
        String refreshToken = authTokenService.genRefreshToken(user);

        user.setRefreshToken(refreshToken); // dirty checking


        return new TokenResponseDto(accessToken, refreshToken);
    }


    @Transactional(readOnly = false)
    public void logout(User user) {
        user.setRefreshToken(null);

    }


    @Transactional(readOnly = false)
    public TokenResponseDto refreshToken(String refreshToken) {
        if (!authTokenService.isValid(refreshToken)) {
            throw new IllegalArgumentException("토큰이 유효하지 않습니다.");
        }

        User user = userRepository.findByRefreshToken(refreshToken)
                .filter(u -> u.getRefreshToken().equals(refreshToken)) // 재확인
                .orElseThrow(() -> new IllegalArgumentException("토큰이 유효하지 않습니다."));

        String newAccessToken = authTokenService.genAccessToken(user);
        String newRefreshToken = authTokenService.genRefreshToken(user);

        user.setRefreshToken(newRefreshToken);
        // save() 생략 가능

        return new TokenResponseDto(newAccessToken, newRefreshToken);
    }

    public User getUserFromAccessToken(String accessToken) {
        log.info("accessToken 파싱 시도 중");

        if (!authTokenService.isValid(accessToken)) {
            log.warn("accessToken 유효하지 않음");
            return null;
        }

        Map<String, Object> payload = authTokenService.payload(accessToken);
        if (payload == null) return null;

        long userId = ((Number) payload.get("userId")).longValue();
        String email = (String) payload.get("email");
        String nickname = (String) payload.get("nickname");
        String roleString = (String) payload.get("role");
        UserRole role = UserRole.valueOf(roleString);

        log.info("token payload userId: {}", userId);

        return User.builder()
                .id(userId)
                .email(email)
                .nickname(nickname)
                .role(role)
                .build();
    }


    public Optional<User> findByRefreshToken(String refreshToken) {
        return userRepository.findByRefreshToken(refreshToken);
    }
}