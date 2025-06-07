package com.project.bearlink.domain.user.user.dto;

import com.project.bearlink.domain.user.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponseDto {
    private Long id;
    private String email;
    private String nickname;
    private String message;

    public UserResponseDto(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.nickname = user.getNickname();
        this.message = "Hello, " + user.getNickname();
    }

    // getter 메서드들 추가
}