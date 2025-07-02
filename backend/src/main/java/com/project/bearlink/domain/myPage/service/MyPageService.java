package com.project.bearlink.domain.myPage.service;

import com.project.bearlink.domain.myPage.dto.UpdateProfileDto;
import com.project.bearlink.domain.user.user.entity.User;
import com.project.bearlink.domain.user.user.repository.UserRepository;
import com.project.bearlink.global.security.auth.SecurityUser;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MyPageService {
    private final UserRepository userRepository;

    public void updateProfile(Long userId, UpdateProfileDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다"));

        if (dto.getBio() != null) {
            user.setBio(dto.getBio());
        }
        if (dto.getNickname() != null) {
            user.setNickname(dto.getNickname());
        }

        userRepository.save(user);
    }
}
