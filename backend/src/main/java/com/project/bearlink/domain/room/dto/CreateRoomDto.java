package com.project.bearlink.domain.room.dto;

import com.project.bearlink.domain.room.entity.RoomMember;
import lombok.Getter;

import java.util.List;

@Getter
public class CreateRoomDto {
    private String name;
    private List<Long> members;
}
