package com.project.bearlink.domain.room.entity;

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
        name = "room_member",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_room_member_unique",
                        columnNames = {"room_id", "user_id"}
                )
        }
)
public class RoomMember extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private LinkRoom room;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private InvitationStatus status;

    private LocalDateTime invitedAt;
    private LocalDateTime respondedAt;

}
