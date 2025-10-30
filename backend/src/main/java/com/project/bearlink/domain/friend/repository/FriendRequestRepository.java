package com.project.bearlink.domain.friend.repository;

import com.project.bearlink.domain.friend.entity.FriendRequest;
import com.project.bearlink.domain.friend.entity.FriendRequestStatus;
import com.project.bearlink.domain.user.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {


    boolean existsByRequesterIdAndReceiverIdAndStatus(Long requesterId, Long receiverId, FriendRequestStatus status);

    @Query("""
SELECT fr FROM FriendRequest fr
JOIN FETCH fr.requester
WHERE fr.receiver.id = :receiverId
AND fr.status = :status
""")
    List<FriendRequest> findByReceiverIdAndStatusWithRequester(@Param("receiverId") Long receiverId,
                                                               @Param("status") FriendRequestStatus status);

    @Query("""
    SELECT fr FROM FriendRequest fr
    JOIN FETCH fr.requester
    JOIN FETCH fr.receiver
    WHERE (fr.requester.id = :userId OR fr.receiver.id = :userId)
    AND fr.status = 'ACCEPTED'
""")
    List<FriendRequest> findAcceptedFriendsWithUsers(@Param("userId") Long userId);


    Optional<FriendRequest> findByRequesterAndReceiverAndStatus(User requester, User receiver, FriendRequestStatus status);

    List<FriendRequest> findByRequesterOrReceiverAndStatus(User requester, User receiver, FriendRequestStatus status);
}