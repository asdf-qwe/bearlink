package com.project.bearlink.domain.room.repository;

import com.project.bearlink.domain.room.entity.LinkRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LinkRoomRepository extends JpaRepository<LinkRoom, Long> {
    @Query("""
        SELECT DISTINCT r
        FROM LinkRoom r
        LEFT JOIN RoomMember rm ON rm.room = r
        WHERE r.owner.id = :userId OR rm.user.id = :userId
    """)
    List<LinkRoom> findAllRoomsParticipatedByUser(@Param("userId") Long userId);
}
