package com.project.bearlink.domain.room.repository;

import com.project.bearlink.domain.link.entity.Link;
import com.project.bearlink.domain.room.entity.RoomLink;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomLinkRepository extends JpaRepository<RoomLink, Long> {

    List<RoomLink> findByRoomOwnerIdAndRoomId(Long ownerId, Long roomId);
}
