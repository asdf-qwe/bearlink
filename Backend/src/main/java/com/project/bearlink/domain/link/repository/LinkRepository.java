package com.project.bearlink.domain.link.repository;

import com.project.bearlink.domain.link.entity.Link;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LinkRepository extends JpaRepository<Link, Long> {
    List<Link> findByCategoryUserIdAndCategoryId(Long userId, Long CategoryId);
}
