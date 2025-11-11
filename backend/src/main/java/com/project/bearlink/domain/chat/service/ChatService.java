package com.project.bearlink.domain.chat.service;

import com.project.bearlink.domain.chat.entity.ChatMessage;
import com.project.bearlink.domain.chat.entity.MessageType;
import com.project.bearlink.domain.chat.repository.ChatMessageRepository;
import com.project.bearlink.domain.room.dto.RoomMessageDto;
import com.project.bearlink.domain.room.entity.LinkRoom;
import com.project.bearlink.domain.room.repository.LinkRoomRepository;
import com.project.bearlink.domain.user.user.entity.User;
import com.project.bearlink.domain.user.user.repository.UserRepository;
import com.project.bearlink.global.exception.ApiException;
import com.project.bearlink.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChatService {
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageRepository chatMessageRepository;
    private final LinkRoomRepository linkRoomRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = false)
    public void handleRoomMessage(Long roomId, RoomMessageDto messageDto){
        LinkRoom room = linkRoomRepository.findById(roomId)
                .orElseThrow(() -> new ApiException(ErrorCode.ROOM_NOT_FOUND));

        User sender = userRepository.findById(messageDto.getSenderId())
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));


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


        messagingTemplate.convertAndSend("/topic/room/" + roomId, messageDto);

    }

    public List<RoomMessageDto> getChatHistory(Long roomId){
        LinkRoom room = linkRoomRepository.findById(roomId)
                .orElseThrow(() -> new ApiException(ErrorCode.ROOM_NOT_FOUND));

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
