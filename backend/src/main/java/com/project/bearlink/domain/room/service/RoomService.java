package com.project.bearlink.domain.room.service;


import com.project.bearlink.domain.friend.entity.FriendRequest;
import com.project.bearlink.domain.friend.entity.FriendRequestStatus;
import com.project.bearlink.domain.friend.repository.FriendRequestRepository;
import com.project.bearlink.domain.room.dto.*;
import com.project.bearlink.domain.room.entity.InvitationStatus;
import com.project.bearlink.domain.room.entity.LinkRoom;
import com.project.bearlink.domain.room.entity.RoomLink;
import com.project.bearlink.domain.room.entity.RoomMember;
import com.project.bearlink.domain.room.repository.LinkRoomRepository;
import com.project.bearlink.domain.room.repository.RoomLinkRepository;
import com.project.bearlink.domain.room.repository.RoomMemberRepository;

import com.project.bearlink.domain.user.user.entity.User;
import com.project.bearlink.domain.user.user.repository.UserRepository;
import com.project.bearlink.global.exception.ApiException;
import com.project.bearlink.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoomService {

    private final UserRepository userRepository;
    private final LinkRoomRepository linkRoomRepository;
    private final RoomMemberRepository roomMemberRepository;
    private final RoomLinkRepository roomLinkRepository;
    private final FriendRequestRepository friendRequestRepository;

    @Transactional(readOnly = false)
    public CreateLinkRoomResponse createRoom(CreateLinkRoomRequest request, User currentUser) {

        LinkRoom room = LinkRoom.builder()
                .name(request.name())
                .owner(currentUser)
                .build();
        linkRoomRepository.save(room);


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
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));

        List<LinkRoom> linkRooms = roomMemberRepository.findAcceptedRoomsByUserId(userId);


        return linkRooms.stream()
                .map(room -> new RoomsDto(room.getId(), room.getName()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = false)
    public void deleteRooms(Long roomId){
        LinkRoom linkRoom= linkRoomRepository.findById(roomId)
                .orElseThrow(()-> new ApiException(ErrorCode.ROOM_NOT_FOUND));
        List<RoomLink> links = roomLinkRepository.findByRoomId(roomId);

        roomLinkRepository.deleteAll(links);
        linkRoomRepository.delete(linkRoom);
    }

    @Transactional(readOnly = false)
    public void inviteUser(Long roomId, Long userId, User inviter) {
        LinkRoom room = linkRoomRepository.findById(roomId)
                .orElseThrow(() -> new ApiException(ErrorCode.ROOM_NOT_FOUND));
        if (!room.getOwner().getId().equals(inviter.getId())) {
            throw new ApiException(ErrorCode.ROOM_INVITE_FORBIDDEN);
        }

        User invitee = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));


        if (roomMemberRepository.existsByRoomAndUser(room, invitee)) {
            throw new ApiException(ErrorCode.ALREADY_INVITED_MEMBER);
        }

        RoomMember member = RoomMember.builder()
                .room(room)
                .user(invitee)
                .status(InvitationStatus.INVITED)
                .invitedAt(LocalDateTime.now())
                .build();
        roomMemberRepository.save(member);
    }

    public List<InvitationResponse> getMyInvitations(User user) {
        List<RoomMember> invitedMembers = roomMemberRepository.findWithRoomByUserAndStatus(user, InvitationStatus.INVITED);

        return invitedMembers.stream()
                .map(m -> new InvitationResponse(
                        m.getId(),
                        m.getRoom().getId(),
                        m.getRoom().getName()
                ))
                .toList();
    }


    @Transactional(readOnly = false)
    public void acceptInvitation(Long roomMemberId, User user) {
        RoomMember member = roomMemberRepository.findById(roomMemberId)
                .orElseThrow(() -> new ApiException(ErrorCode.ROOM_MEMBER_NOT_FOUND));
        if (!member.getUser().getId().equals(user.getId())) {
            throw new ApiException(ErrorCode.INVITATION_ACCESS_DENIED);
        }
        if (member.getStatus() != InvitationStatus.INVITED) {
            throw new ApiException(ErrorCode.INVITATION_ALREADY_ACCEPTED);
        }

        member.setStatus(InvitationStatus.ACCEPTED);
        member.setRespondedAt(LocalDateTime.now());

    }

    @Transactional(readOnly = false)
    public void declineInvitation(Long roomMemberId, User user) {
        RoomMember member = roomMemberRepository.findById(roomMemberId)
                .orElseThrow(() -> new ApiException(ErrorCode.ROOM_MEMBER_NOT_FOUND));
        if (!member.getUser().getId().equals(user.getId())) {
            throw new ApiException(ErrorCode.INVITATION_ACCESS_DENIED);
        }
        if (member.getStatus() != InvitationStatus.INVITED) {
            throw new ApiException(ErrorCode.INVITATION_ALREADY_ACCEPTED);
        }

        member.setStatus(InvitationStatus.DECLINED);
        member.setRespondedAt(LocalDateTime.now());
    }

    public List<RoomLinkListDto> getRoomLinks(Long userId, Long roomId) {
        List<RoomLink> links = roomLinkRepository.findByRoomOwnerIdAndRoomId(userId, roomId);

        return links.stream()
                .map(link -> new RoomLinkListDto(
                        link.getId(),
                        link.getTitle(),
                        link.getUrl()
                ))
                .collect(Collectors.toList());
    }


    public List<InviteFriendWithStatusResponse> getInviteFriendsWithStatus(User currentUser, Long roomId) {
        LinkRoom room = linkRoomRepository.findById(roomId)
                .orElseThrow(() -> new ApiException(ErrorCode.ROOM_NOT_FOUND));

        List<FriendRequest> acceptedFriends = friendRequestRepository.findByRequesterOrReceiverAndStatus(
                currentUser,
                currentUser,
                FriendRequestStatus.ACCEPTED
        );

        List<RoomMember> roomMembers = roomMemberRepository.findByRoomId(roomId);

        Map<Long, InvitationStatus> memberStatusMap = roomMembers.stream()
                .collect(Collectors.toMap(
                        rm -> rm.getUser().getId(),
                        RoomMember::getStatus
                ));

        return acceptedFriends.stream()
                .map(fr -> {
                    User friend = fr.getRequester().getId().equals(currentUser.getId())
                            ? fr.getReceiver()
                            : fr.getRequester();

                    InvitationStatus status = memberStatusMap.getOrDefault(friend.getId(), null);

                    String invitationStatus;
                    if (status == null) {
                        invitationStatus = "NOT_INVITED";
                    } else if (status == InvitationStatus.INVITED) {
                        invitationStatus = "INVITED";
                    } else if (status == InvitationStatus.ACCEPTED) {
                        invitationStatus = "ACCEPTED";
                    } else {
                        invitationStatus = "DECLINED";
                    }

                    return new InviteFriendWithStatusResponse(
                            friend.getId(),
                            friend.getNickname(),
                            friend.getEmail(),
                            invitationStatus
                    );
                })
                .toList();
    }


    public List<RoomMemberList> getMembers(Long roomId){
        LinkRoom room = linkRoomRepository.findById(roomId)
                .orElseThrow(()-> new ApiException(ErrorCode.USER_NOT_FOUND));

        List<RoomMember> members = roomMemberRepository.findByRoomAndStatus(room, InvitationStatus.ACCEPTED);

        return members.stream()
                .map(member -> new RoomMemberList(
                        member.getId(),
                        member.getUser().getNickname()
                ))
                .toList();
    }

    public RoomsDto getRoom(Long roomId){

        LinkRoom linkRoom = linkRoomRepository.findById(roomId)
                .orElseThrow(()->new ApiException(ErrorCode.ROOM_NOT_FOUND));
        return new RoomsDto(
                linkRoom.getId(),
                linkRoom.getName()
        );
    }
}