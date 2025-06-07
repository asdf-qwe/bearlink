package com.project.bearlink.domain.user.user.service;

import com.project.bearlink.domain.user.user.dto.SignupRequestDto;
import com.project.bearlink.domain.user.user.entity.Role;
import com.project.bearlink.domain.user.user.entity.User;
import com.project.bearlink.domain.user.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public void signup(SignupRequestDto requestDto){
        if(userRepository.existsByEmail(requestDto.getEmail())){
            throw new IllegalArgumentException("이미 사용중인 이메일입니다");
        }
        User user = User.builder()
                .email(requestDto.getEmail())
                .password(passwordEncoder.encode(requestDto.getPassword()))
                .nickname(requestDto.getNickname())
                .role(Role.USER)
                .build();

        userRepository.save(user);
    }
}
