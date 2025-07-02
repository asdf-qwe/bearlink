package com.project.bearlink.domain.friend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor  // 기본 생성자 추가
@AllArgsConstructor
public class FriendRequestDto {
    private Long receiverId; // 친구 신청 대상자 ID
}