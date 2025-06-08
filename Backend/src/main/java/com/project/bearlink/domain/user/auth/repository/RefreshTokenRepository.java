package com.project.bearlink.domain.user.auth.repository;

import com.project.bearlink.domain.user.auth.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {
}
