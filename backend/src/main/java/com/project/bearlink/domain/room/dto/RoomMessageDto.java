package com.project.bearlink.domain.room.dto;

import com.project.bearlink.domain.chat.entity.MessageType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomMessageDto {

    private Long roomId;           // 방 ID
    private Long senderId;         // 보낸 사람 ID
    private String senderName;     // 보낸 사람 이름 or 닉네임

    private MessageType type;      // 메시지 타입 (TALK, LINK_ADD 등)

    private String content;        // 채팅 내용 or 링크 ID

    // (선택) 링크 작업시 사용할 데이터
    private String linkTitle;
    private String linkUrl;
    private String linkThumbnail;
}