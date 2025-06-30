package com.project.bearlink.domain.room.controller;

import com.project.bearlink.domain.room.dto.CreateRoomDto;
import com.project.bearlink.domain.room.dto.LinkRoomListDto;
import com.project.bearlink.domain.room.entity.LinkRoom;
import com.project.bearlink.domain.room.service.RoomService;
import com.project.bearlink.global.security.auth.SecurityUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/room")
public class Ap1V1RoomController {
    private final RoomService roomService;

    @PostMapping
    public ResponseEntity<String> createRoom(CreateRoomDto dto, @AuthenticationPrincipal SecurityUser user){

        roomService.createRoom(dto, user.getId());
        return ResponseEntity.ok().body("방 생성 완료");
    }

}
