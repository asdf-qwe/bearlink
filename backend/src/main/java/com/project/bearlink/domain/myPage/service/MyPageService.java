package com.project.bearlink.domain.myPage.service;

import com.project.bearlink.domain.myPage.dto.UpdateProfileDto;
import com.project.bearlink.domain.user.user.entity.User;
import com.project.bearlink.domain.user.user.repository.UserRepository;
import com.project.bearlink.global.exception.ApiException;
import com.project.bearlink.global.exception.ErrorCode;
import com.project.bearlink.global.security.auth.SecurityUser;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MyPageService {
    private final UserRepository userRepository;

    @Transactional(readOnly = false)
    public void updateProfile(Long userId, UpdateProfileDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));

        if (dto.getBio() != null) {
            user.setBio(dto.getBio());
        }
        if (dto.getNickname() != null) {
            user.setNickname(dto.getNickname());
        }

        userRepository.save(user);
    }
}
