package com.project.bearlink.domain.user.user.service;

import com.project.bearlink.domain.user.user.dto.SignupRequestDto;
import com.project.bearlink.domain.user.user.entity.User;
import com.project.bearlink.domain.user.user.entity.UserRole;
import com.project.bearlink.domain.user.user.repository.UserRepository;
import com.project.bearlink.global.exception.ApiException;
import com.project.bearlink.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // 기본은 조회 전용
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = false)
    public User signup(SignupRequestDto request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ApiException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        User user = User.builder()
                .loginId(request.getLoginId())
                .password(passwordEncoder.encode(request.getPassword()))
                .nickname(request.getNickname())
                .email(request.getEmail())
                .imageUrl(request.getImageUrl())
                .bio(request.getNickname() + "님의 프로필 입니다.")
                .role(UserRole.USER)
                .build();

        return userRepository.save(user);
    }


    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean existsByLoginId(String loginId) {
        return userRepository.existsByLoginId(loginId);
    }


    public User findById(Long id) {
        return userRepository.findByIdWithRelations(id)
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));
    }
}