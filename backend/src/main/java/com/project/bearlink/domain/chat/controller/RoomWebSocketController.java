package com.project.bearlink.domain.chat.controller;

import com.project.bearlink.domain.chat.dto.ChatMessageDto;
import com.project.bearlink.domain.chat.entity.ChatMessage;
import com.project.bearlink.domain.chat.entity.MessageType;
import com.project.bearlink.domain.chat.repository.ChatMessageRepository;
import com.project.bearlink.domain.room.dto.RoomMessageDto;
import com.project.bearlink.domain.room.entity.LinkRoom;
import com.project.bearlink.domain.room.repository.LinkRoomRepository;
import com.project.bearlink.domain.user.user.entity.User;
import com.project.bearlink.domain.user.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@RequiredArgsConstructor
@Controller
public class RoomWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageRepository chatMessageRepository;
    private final LinkRoomRepository linkRoomRepository;
    private final UserRepository userRepository;

    @MessageMapping("/room/{roomId}")
    public void handleRoomMessage(@DestinationVariable Long roomId, RoomMessageDto messageDto) {

        LinkRoom room = linkRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));

        User sender = userRepository.findById(messageDto.getSenderId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // ✅ 채팅 관련 메시지는 DB 저장
        if (messageDto.getType() == MessageType.TALK ||
                messageDto.getType() == MessageType.ENTER ||
                messageDto.getType() == MessageType.LEAVE) {

            ChatMessage chatMessage = ChatMessage.builder()
                    .room(room)
                    .sender(sender)
                    .type(messageDto.getType())
                    .content(messageDto.getContent())
                    .build();

            chatMessageRepository.save(chatMessage);
        }

        // ✅ 모든 메시지는 실시간 전송
        messagingTemplate.convertAndSend("/topic/room/" + roomId, messageDto);
    }

    @Transactional
    @GetMapping("/api/rooms/{roomId}/messages")
    @ResponseBody
    public List<RoomMessageDto> getChatHistory(@PathVariable Long roomId) {
        LinkRoom room = linkRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        return chatMessageRepository.findTop50ByRoomOrderByCreatedAtDesc(room).stream()
                .map(entity -> RoomMessageDto.builder()
                        .roomId(roomId)
                        .senderId(entity.getSender().getId())
                        .senderName(entity.getSender().getNickname())
                        .type(entity.getType())
                        .content(entity.getContent())
                        .build())
                .toList();
    }
}