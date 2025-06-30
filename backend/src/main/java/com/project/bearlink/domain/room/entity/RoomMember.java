package com.project.bearlink.domain.room.entity;

import com.project.bearlink.domain.user.user.entity.User;
import com.project.bearlink.global.jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
public class RoomMember extends BaseEntity {

    @ManyToOne
    private LinkRoom room;

    @ManyToOne
    private User user;

    @Enumerated(EnumType.STRING)
    private RoomRole role; // OWNER or MEMBER

    private int memberCount;
}
