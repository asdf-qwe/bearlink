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
import com.project.bearlink.domain.user.user.entity.User;
import com.project.bearlink.domain.user.user.repository.UserRepository;
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

    private final LinkRoomRepository linkRoomRepository;
    private final RoomLinkRepository roomLinkRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;


    @PostMapping
    public ResponseEntity<?> addLink(@PathVariable Long roomId, @RequestBody RoomLinkDto dto, @AuthenticationPrincipal SecurityUser currentUser) {
        LinkRoom room = linkRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("방을 찾을 수 없습니다"));

        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다"));


        RoomLink saved = roomLinkRepository.save(RoomLink.builder()
                .title(dto.getTitle())
                .url(dto.getUrl())
                .room(room)
                .creator(user)
                .build());

        RoomMessageDto message = RoomMessageDto.builder()
                .roomId(roomId)
                .senderId(currentUser.getId())
                .senderName(currentUser.getNickname())
                .type(MessageType.LINK_ADD)
                .content(saved.getId().toString())
                .linkTitle(saved.getTitle())
                .linkUrl(saved.getUrl())
                .build();

        messagingTemplate.convertAndSend("/topic/room/" + roomId, message);

        return ResponseEntity.ok(saved.getId());
    }

    @PutMapping("/{linkId}")
    public ResponseEntity<?> updateLink(@PathVariable Long roomId, @PathVariable Long linkId, @RequestBody RoomLinkDto dto, @AuthenticationPrincipal SecurityUser currentUser) {
        RoomLink link = roomLinkRepository.findById(linkId)
                .orElseThrow(() -> new IllegalArgumentException("링크를 찾을 수 없습니다"));

        link.setTitle(dto.getTitle());
        link.setUrl(dto.getUrl());
        roomLinkRepository.save(link);

        RoomMessageDto message = RoomMessageDto.builder()
                .roomId(roomId)
                .senderId(currentUser.getId())
                .senderName(currentUser.getNickname())
                .type(MessageType.LINK_UPDATE)
                .content(linkId.toString())
                .linkTitle(dto.getTitle())
                .linkUrl(dto.getUrl())
                .build();

        messagingTemplate.convertAndSend("/topic/room/" + roomId, message);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{linkId}")
    public ResponseEntity<?> deleteLink(@PathVariable Long roomId, @PathVariable Long linkId, @AuthenticationPrincipal SecurityUser currentUser) {
        roomLinkRepository.deleteById(linkId);

        RoomMessageDto message = RoomMessageDto.builder()
                .roomId(roomId)
                .senderId(currentUser.getId())
                .senderName(currentUser.getNickname())
                .type(MessageType.LINK_DELETE)
                .content(linkId.toString())
                .build();

        messagingTemplate.convertAndSend("/topic/room/" + roomId, message);

        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<RoomLinkListDto>> getLinks(@PathVariable Long roomId) {
        List<RoomLink> links = roomLinkRepository.findByRoomId(roomId);

        List<RoomLinkListDto> result = links.stream()
                .map(link -> new RoomLinkListDto(
                        link.getId(),
                        link.getTitle(),
                        link.getUrl()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }
}