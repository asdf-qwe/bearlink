package com.project.bearlink.domain.link.repository;

import com.project.bearlink.domain.link.entity.Link;
import com.project.bearlink.domain.link.entity.PreviewStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LinkRepository extends JpaRepository<Link, Long> {
    List<Link> findByCategoryUserIdAndCategoryId(Long userId, Long CategoryId);
    List<Link> findByCategoryId(Long categoryId);
    Optional<Link> findFirstByPreviewStatus(PreviewStatus status);
    List<Link> findAllByPreviewStatus(PreviewStatus status);
}
