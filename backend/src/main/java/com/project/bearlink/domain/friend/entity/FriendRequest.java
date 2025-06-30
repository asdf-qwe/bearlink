package com.project.bearlink.domain.friend.entity;

import com.project.bearlink.domain.user.user.entity.User;
import com.project.bearlink.global.jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
public class FriendRequest extends BaseEntity {

    // 친구 신청자
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id")
    private User requester;

    // 친구 수락자
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id")
    private User receiver;

    @Enumerated(EnumType.STRING)
    private FriendRequestStatus status = FriendRequestStatus.PENDING;

    private LocalDateTime requestedAt = LocalDateTime.now();
    private LocalDateTime respondedAt;

}