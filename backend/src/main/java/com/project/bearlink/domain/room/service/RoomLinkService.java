package com.project.bearlink.domain.room.service;

import com.project.bearlink.domain.chat.entity.MessageType;
import com.project.bearlink.domain.room.dto.RoomLinkDto;
import com.project.bearlink.domain.room.dto.RoomLinkListDto;
import com.project.bearlink.domain.room.dto.RoomMessageDto;
import com.project.bearlink.domain.room.entity.LinkRoom;
import com.project.bearlink.domain.room.entity.RoomLink;
import com.project.bearlink.domain.room.repository.LinkRoomRepository;
import com.project.bearlink.domain.room.repository.RoomLinkRepository;
import com.project.bearlink.domain.user.user.entity.User;
import com.project.bearlink.domain.user.user.repository.UserRepository;
import com.project.bearlink.global.exception.ApiException;
import com.project.bearlink.global.exception.ErrorCode;
import com.project.bearlink.global.security.auth.SecurityUser;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoomLinkService {

    private final LinkRoomRepository linkRoomRepository;
    private final UserRepository userRepository;
    private final RoomLinkRepository roomLinkRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional(readOnly = false)
    public Long addLink(Long roomId, RoomLinkDto dto,SecurityUser currentUser){
        LinkRoom room = linkRoomRepository.findById(roomId)
                .orElseThrow(() -> new ApiException(ErrorCode.ROOM_NOT_FOUND));

        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));


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

        return saved.getId();
    }

    @Transactional(readOnly = false)
    public void updateLink(Long roomId, Long linkId, RoomLinkDto dto, SecurityUser currentUser){
        RoomLink link = roomLinkRepository.findById(linkId)
                .orElseThrow(() -> new ApiException(ErrorCode.LINK_NOT_FOUND));

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
    }

    @Transactional(readOnly = false)
    public void deleteLink(Long roomId, Long linkId, SecurityUser currentUser){
        roomLinkRepository.deleteById(linkId);

        RoomMessageDto message = RoomMessageDto.builder()
                .roomId(roomId)
                .senderId(currentUser.getId())
                .senderName(currentUser.getNickname())
                .type(MessageType.LINK_DELETE)
                .content(linkId.toString())
                .build();

        messagingTemplate.convertAndSend("/topic/room/" + roomId, message);
    }

    public List<RoomLinkListDto> getLinks(Long roomId){
        List<RoomLink> links = roomLinkRepository.findByRoomId(roomId);

        return links.stream()
                .map(link -> new RoomLinkListDto(
                        link.getId(),
                        link.getTitle(),
                        link.getUrl()
                ))
                .collect(Collectors.toList());
    }
}
