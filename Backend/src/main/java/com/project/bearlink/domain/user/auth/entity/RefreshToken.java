package com.project.bearlink.domain.user.auth.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
public class RefreshToken {

    @Id
    private String email;

    @Column(nullable = false)
    private String token;

    public void update(String token) {
        this.token = token;
    }
}