package com.project.bearlink.domain.room.repository;

import com.project.bearlink.domain.room.entity.RoomMember;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomMemberRepository extends JpaRepository<RoomMember, Long> {
}
