package com.project.bearlink.domain.room.repository;


import com.project.bearlink.domain.friend.entity.FriendRequest;
import com.project.bearlink.domain.friend.entity.FriendRequestStatus;
import com.project.bearlink.domain.link.entity.Link;
import com.project.bearlink.domain.room.entity.InvitationStatus;
import com.project.bearlink.domain.room.entity.LinkRoom;
import com.project.bearlink.domain.room.entity.RoomMember;
import com.project.bearlink.domain.user.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface RoomMemberRepository extends JpaRepository<RoomMember, Long> {
    boolean existsByRoomAndUser(LinkRoom room, User user);
    List<RoomMember> findByUserAndStatus(User user, InvitationStatus status);
    List<RoomMember> findByRoomId(Long roomId);
    List<RoomMember> findByRoomAndStatus(LinkRoom room, InvitationStatus status);

    @Query("SELECT DISTINCT rm.room FROM RoomMember rm WHERE rm.user.id = :userId AND rm.status = 'ACCEPTED'")
    List<LinkRoom> findAcceptedRoomsByUserId(@Param("userId") Long userId);

    @Query("""
    SELECT m FROM RoomMember m
    JOIN FETCH m.room
    WHERE m.user = :user AND m.status = :status
""")
    List<RoomMember> findWithRoomByUserAndStatus(
            @Param("user") User user,
            @Param("status") InvitationStatus status
    );
}
