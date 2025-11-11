package com.project.bearlink.domain.room.controller;

import com.project.bearlink.domain.chat.entity.MessageType;
import com.project.bearlink.domain.link.dto.LinkPreviewDto;

import com.project.bearlink.domain.room.dto.RoomLinkDto;
import com.project.bearlink.domain.room.dto.RoomLinkListDto;
import com.project.bearlink.domain.room.dto.RoomMessageDto;
import com.project.bearlink.domain.room.entity.LinkRoom;
import com.project.bearlink.domain.room.entity.RoomLink;
import com.project.bearlink.domain.room.repository.LinkRoomRepository;
import com.project.bearlink.domain.room.repository.RoomLinkRepository;
import com.project.bearlink.domain.room.service.RoomLinkService;
import com.project.bearlink.domain.user.user.entity.User;
import com.project.bearlink.domain.user.user.repository.UserRepository;
import com.project.bearlink.global.exception.ApiException;
import com.project.bearlink.global.exception.ErrorCode;
import com.project.bearlink.global.response.ApiResponse;
import com.project.bearlink.global.security.auth.SecurityUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/rooms/{roomId}/links")
public class ApiV1RoomLinkController {
    private final RoomLinkService roomLinkService;

    @PostMapping
    public ResponseEntity<ApiResponse<?>> addLink(@PathVariable Long roomId, @RequestBody RoomLinkDto dto, @AuthenticationPrincipal SecurityUser currentUser) {
        Long RoomLinkId = roomLinkService.addLink(roomId,dto,currentUser);
        return ResponseEntity.ok(ApiResponse.ok(RoomLinkId));
    }

    @PutMapping("/{linkId}")
    public ResponseEntity<ApiResponse<String>> updateLink(@PathVariable Long roomId, @PathVariable Long linkId, @RequestBody RoomLinkDto dto, @AuthenticationPrincipal SecurityUser currentUser) {
        roomLinkService.updateLink(roomId, linkId, dto, currentUser);
        return ResponseEntity.ok(ApiResponse.ok("수정 완료"));
    }

    @DeleteMapping("/{linkId}")
    public ResponseEntity<ApiResponse<String>> deleteLink(@PathVariable Long roomId, @PathVariable Long linkId, @AuthenticationPrincipal SecurityUser currentUser) {
        roomLinkService.deleteLink(roomId, linkId, currentUser);
        return ResponseEntity.ok(ApiResponse.ok("삭제 완료"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RoomLinkListDto>>> getLinks(@PathVariable Long roomId) {
        List<RoomLinkListDto> result = roomLinkService.getLinks(roomId);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }
}