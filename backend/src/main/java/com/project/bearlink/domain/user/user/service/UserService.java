package com.project.bearlink.domain.user.user.service;

import com.project.bearlink.domain.user.user.dto.SignupRequestDto;
import com.project.bearlink.domain.user.user.entity.User;
import com.project.bearlink.domain.user.user.entity.UserRole;
import com.project.bearlink.domain.user.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * 회원가입
     */
    @Transactional
    public User signup(SignupRequestDto request) {

        // 이메일 중복 체크
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        // 유저 생성
        User user = User.builder()
                .loginId(request.getLoginId())
                .password(passwordEncoder.encode(request.getPassword()))
                .nickname(request.getNickname())
                .email(request.getEmail())
                .imageUrl(request.getImageUrl())
                .role(UserRole.USER)
                .build();

        return userRepository.save(user);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean existsByLoginId(String loginId) {return userRepository.existsByLoginId(loginId);}

    @Transactional(readOnly = true)
    public User findById(Long id) {
        return userRepository.findByIdWithRelations(id)
                .orElseThrow(() -> new IllegalArgumentException("관계에 해당하는 유저 없음"));
    }
}