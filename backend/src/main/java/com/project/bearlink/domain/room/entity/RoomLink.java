package com.project.bearlink.domain.room.entity;

import com.project.bearlink.domain.user.user.entity.User;
import com.project.bearlink.global.jpa.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
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
public class RoomLink extends BaseEntity {

    private String title;
    private String url;
    private String thumbnailImageUrl;

    @ManyToOne
    private LinkRoom room;

    @ManyToOne
    private User creator;

}