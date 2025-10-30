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
@Table(
        name = "friend_request",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_friend_request_pair",
                        columnNames = {"requester_id", "receiver_id"}
                )
        }
)
public class FriendRequest extends BaseEntity {


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id")
    private User requester;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id")
    private User receiver;

    @Enumerated(EnumType.STRING)
    private FriendRequestStatus status = FriendRequestStatus.PENDING;

    private LocalDateTime requestedAt = LocalDateTime.now();
    private LocalDateTime respondedAt;

}