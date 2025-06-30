package com.project.bearlink.domain.friend.dto;

import com.project.bearlink.domain.friend.entity.FriendRequestStatus;
import lombok.Getter;


public record FindFriendDto (Long id, String nickname, String imageUrl, FriendRequestStatus status){
}
