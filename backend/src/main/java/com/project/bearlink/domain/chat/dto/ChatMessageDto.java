package com.project.bearlink.domain.chat.dto;

import com.project.bearlink.domain.chat.entity.MessageType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageDto {

    private Long roomId;
    private Long senderId;
    private String senderName;
    private String content;
    private MessageType type;
}