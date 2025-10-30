package com.project.bearlink.domain.user.user.repository;

import com.project.bearlink.domain.friend.dto.FindFriendDto;
import com.project.bearlink.domain.user.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByLoginId(String loginId);

    boolean existsByEmail(String email);

    boolean existsByLoginId(String loginId);

    Optional<User> findByRefreshToken(String refreshToken);

    @Query("""
    SELECT u FROM User u
    WHERE u.id = :id
""")
    Optional<User> findByIdWithRelations(@Param("id") Long id);

    @Query("""
SELECT new com.project.bearlink.domain.friend.dto.FindFriendDto(
    u.id,
    u.nickname,
    u.imageUrl,
    'NONE'
)
FROM User u
WHERE u.id != :currentUserId
AND u.nickname LIKE CONCAT('%', :keyword, '%')
AND NOT EXISTS (
    SELECT 1 FROM FriendRequest fr
    WHERE (
        (fr.requester.id = :currentUserId AND fr.receiver.id = u.id)
        OR
        (fr.requester.id = u.id AND fr.receiver.id = :currentUserId)
    )
    AND fr.status IN ('PENDING', 'ACCEPTED')
)
""")
    Page<FindFriendDto> searchOnlyUnrelatedUsers(
            @Param("keyword") String keyword,
            @Param("currentUserId") Long currentUserId,
            Pageable pageable
    );
}
