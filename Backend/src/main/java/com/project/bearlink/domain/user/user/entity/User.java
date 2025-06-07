package com.project.bearlink.domain.user.user.entity;


import com.project.bearlink.domain.categoryTab.entity.Category;
import com.project.bearlink.global.jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Builder
@ToString
@Table(name="users")
public class User extends BaseEntity {

    @Column(unique = true)
    private String oauthId;    // 카카오에서 받아올 oauthId -> 추가 필요
    @Column(unique = true, nullable = false)
    private String email;
    @Column(nullable = false)
    private String nickname;
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Category> categories = new ArrayList<>();
}
