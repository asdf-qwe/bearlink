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
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
public class LinkRoom extends BaseEntity {

    private String name;

    @ManyToOne
    private User owner;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL)
    private List<RoomMember> members;

    private int memberCount;
}