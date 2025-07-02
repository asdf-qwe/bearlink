package com.project.bearlink.domain.room.service;


import com.project.bearlink.domain.room.dto.CreateLinkRoomRequest;
import com.project.bearlink.domain.room.dto.CreateLinkRoomResponse;
import com.project.bearlink.domain.room.dto.RoomLinkListDto;
import com.project.bearlink.domain.room.dto.RoomsDto;
import com.project.bearlink.domain.room.entity.InvitationStatus;
import com.project.bearlink.domain.room.entity.LinkRoom;
import com.project.bearlink.domain.room.entity.RoomLink;
import com.project.bearlink.domain.room.entity.RoomMember;
import com.project.bearlink.domain.room.repository.LinkRoomRepository;
import com.project.bearlink.domain.room.repository.RoomLinkRepository;
import com.project.bearlink.domain.room.repository.RoomMemberRepository;

import com.project.bearlink.domain.user.user.entity.User;
import com.project.bearlink.domain.user.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final UserRepository userRepository;
    private final LinkRoomRepository linkRoomRepository;
    private final RoomMemberRepository roomMemberRepository;
    private final RoomLinkRepository roomLinkRepository;

    public CreateLinkRoomResponse createRoom(CreateLinkRoomRequest request, User currentUser) {
        // 1. 링크룸 생성
        LinkRoom room = LinkRoom.builder()
                .name(request.name())
                .owner(currentUser)
                .build();
        linkRoomRepository.save(room);

        // 2. 본인을 RoomMember로 추가 (바로 ACCEPTED)
        RoomMember selfMember = RoomMember.builder()
                .room(room)
                .user(currentUser)
                .status(InvitationStatus.ACCEPTED)
                .invitedAt(LocalDateTime.now())
                .respondedAt(LocalDateTime.now())
                .build();
        roomMemberRepository.save(selfMember);

        return new CreateLinkRoomResponse(room.getId(), room.getName());
    }

    public List<RoomsDto> getRooms(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다"));

        List<LinkRoom> linkRooms = linkRoomRepository.findByOwnerId(userId);

        // 변환
        return linkRooms.stream()
                .map(room -> new RoomsDto(room.getId(), room.getName()))
                .collect(Collectors.toList());
    }

    public void inviteUser(Long roomId, Long userId, User inviter) {
        LinkRoom room = linkRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("방을 찾을 수 없음"));
        if (!room.getOwner().getId().equals(inviter.getId())) {
            throw new AccessDeniedException("Only the owner can invite.");
        }

        User invitee = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없음"));

        // 중복 초대 방지
        if (roomMemberRepository.existsByRoomAndUser(room, invitee)) {
            throw new IllegalStateException("User already invited or a member.");
        }

        RoomMember member = RoomMember.builder()
                .room(room)
                .user(invitee)
                .status(InvitationStatus.INVITED)
                .invitedAt(LocalDateTime.now())
                .build();
        roomMemberRepository.save(member);
    }

    // 수락
    public void acceptInvitation(Long roomMemberId, User user) {
        RoomMember member = roomMemberRepository.findById(roomMemberId)
                .orElseThrow(() -> new IllegalArgumentException("Invitation not found"));
        if (!member.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("Not your invitation.");
        }
        if (member.getStatus() != InvitationStatus.INVITED) {
            throw new IllegalStateException("Already responded.");
        }

        member.setStatus(InvitationStatus.ACCEPTED);
        member.setRespondedAt(LocalDateTime.now());
        roomMemberRepository.save(member);
    }

    // 거절
    public void declineInvitation(Long roomMemberId, User user) {
        RoomMember member = roomMemberRepository.findById(roomMemberId)
                .orElseThrow(() -> new IllegalArgumentException("Invitation not found"));
        if (!member.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("Not your invitation.");
        }
        if (member.getStatus() != InvitationStatus.INVITED) {
            throw new IllegalStateException("Already responded.");
        }

        member.setStatus(InvitationStatus.DECLINED);
        member.setRespondedAt(LocalDateTime.now());
        roomMemberRepository.save(member);
    }

    public List<RoomLinkListDto> getRoomLinks(Long userId, Long roomId) {
        List<RoomLink> links = roomLinkRepository.findByRoomOwnerIdAndRoomId(userId, roomId);

        return links.stream()
                .map(link -> new RoomLinkListDto(
                        link.getId(),
                        link.getTitle(),
                        link.getUrl(),
                        link.getThumbnailImageUrl()
                ))
                .collect(Collectors.toList());
    }
}