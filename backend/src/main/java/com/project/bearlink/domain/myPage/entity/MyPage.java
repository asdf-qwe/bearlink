package com.project.bearlink.domain.myPage.entity;

import com.project.bearlink.domain.user.user.entity.User;
import com.project.bearlink.global.jpa.BaseEntity;
import jakarta.persistence.*;

@Entity
public class MyPage extends BaseEntity{

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;


    @Enumerated(EnumType.STRING)
    private ViewMode viewMode; // CARD, LIST
    private boolean darkModeEnabled;


}