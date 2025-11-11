package com.project.bearlink.domain.chat.controller;

import com.project.bearlink.domain.chat.dto.ChatMessageDto;
import com.project.bearlink.domain.chat.entity.ChatMessage;
import com.project.bearlink.domain.chat.entity.MessageType;
import com.project.bearlink.domain.chat.repository.ChatMessageRepository;
import com.project.bearlink.domain.chat.service.ChatService;
import com.project.bearlink.domain.room.dto.RoomMessageDto;
import com.project.bearlink.domain.room.entity.LinkRoom;
import com.project.bearlink.domain.room.repository.LinkRoomRepository;
import com.project.bearlink.domain.user.user.entity.User;
import com.project.bearlink.domain.user.user.repository.UserRepository;
import com.project.bearlink.global.exception.ApiException;
import com.project.bearlink.global.exception.ErrorCode;
import com.project.bearlink.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
public class ApiV1ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageRepository chatMessageRepository;
    private final LinkRoomRepository linkRoomRepository;
    private final UserRepository userRepository;
    private final ChatService chatService;

    @MessageMapping("/room/{roomId}")
    public void handleRoomMessage(@DestinationVariable Long roomId, RoomMessageDto messageDto) {
        chatService.handleRoomMessage(roomId,messageDto);
    }


    @GetMapping("/api/rooms/{roomId}/messages")
    public ResponseEntity<ApiResponse<List<RoomMessageDto>>> getChatHistory(@PathVariable Long roomId) {
        List<RoomMessageDto> messageDto = chatService.getChatHistory(roomId);
        return ResponseEntity.ok(ApiResponse.ok(messageDto));
    }
}