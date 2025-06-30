package com.project.bearlink.domain.room.entity;

import com.project.bearlink.domain.user.user.entity.User;
import com.project.bearlink.global.jpa.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;

import java.time.LocalDateTime;

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