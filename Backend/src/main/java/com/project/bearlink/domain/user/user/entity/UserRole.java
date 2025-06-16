package com.project.bearlink.domain.user.user.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum UserRole {
    USER,
    ADMIN;

    public boolean isAdmin() {
        return this == ADMIN;
    }
}
