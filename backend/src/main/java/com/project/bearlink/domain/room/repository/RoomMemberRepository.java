package com.project.bearlink.domain.room.repository;


import com.project.bearlink.domain.link.entity.Link;
import com.project.bearlink.domain.room.entity.LinkRoom;
import com.project.bearlink.domain.room.entity.RoomMember;
import com.project.bearlink.domain.user.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface RoomMemberRepository extends JpaRepository<RoomMember, Long> {
    boolean existsByRoomAndUser(LinkRoom room, User user);


}
