package com.project.bearlink.domain.link.repository;

import com.project.bearlink.domain.link.entity.Link;
import com.project.bearlink.domain.link.entity.PreviewStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LinkRepository extends JpaRepository<Link, Long> {
    List<Link> findByCategoryUserIdAndCategoryId(Long userId, Long CategoryId);
    List<Link> findByCategoryId(Long categoryId);
    @Query("SELECT l.title FROM Link l WHERE l.id = :linkId")
    Optional<String> findTitleById(@Param("linkId") Long linkId);

    @Query("SELECT l FROM Link l WHERE l.user.id = :userId AND l.category.id = :categoryId AND " +
            "(l.url LIKE '%youtube.com/watch%' OR l.url LIKE '%youtu.be/%')")
    List<Link> findYoutubeLinksByUserAndCategory(@Param("userId") Long userId, @Param("categoryId") Long categoryId);

}
