package com.project.bearlink.domain.chat.repository;

import com.project.bearlink.domain.chat.entity.ChatMessage;
import com.project.bearlink.domain.room.entity.LinkRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findTop50ByRoomOrderByCreatedAtDesc(LinkRoom room);
}