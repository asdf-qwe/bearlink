package com.project.bearlink.domain.room.controller;

import com.project.bearlink.domain.room.dto.*;
import com.project.bearlink.domain.room.entity.LinkRoom;
import com.project.bearlink.domain.room.service.RoomService;
import com.project.bearlink.domain.user.user.entity.User;
import com.project.bearlink.domain.user.user.repository.UserRepository;
import com.project.bearlink.global.security.auth.SecurityUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/room")
public class Ap1V1RoomController {
    private final RoomService linkRoomService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<CreateLinkRoomResponse> createRoom(
            @RequestBody CreateLinkRoomRequest request,
            @AuthenticationPrincipal SecurityUser securityUser
    ) {
        User user = userRepository.findById(securityUser.getId())
                .orElseThrow(() -> new IllegalArgumentException("유저 찾을 수 없음"));

        CreateLinkRoomResponse response = linkRoomService.createRoom(request, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<RoomsDto>> getRooms(@AuthenticationPrincipal SecurityUser user){

        return ResponseEntity.ok(linkRoomService.getRooms(user.getId()));
    }

    @GetMapping("/links")
    public ResponseEntity<List<RoomLinkListDto>> getRoomLinks(@AuthenticationPrincipal SecurityUser user,
                                                              @RequestParam Long roomId){
        List<RoomLinkListDto> links = linkRoomService.getRoomLinks(user.getId(), roomId);
        return ResponseEntity.ok(links);
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<RoomsDto> getRoom(@PathVariable Long roomId) {
        RoomsDto linkRoom = linkRoomService.getRoom(roomId);

        return ResponseEntity.ok(linkRoom);
    }

    @PostMapping("/{roomId}/invite")
    public ResponseEntity<Void> inviteUser(
            @PathVariable Long roomId,
            @RequestBody RoomInviteRequest request,
            @AuthenticationPrincipal SecurityUser securityUser
    ) {
        User user = userRepository.findById(securityUser.getId())
                .orElseThrow(() -> new IllegalArgumentException("유저 찾을 수 없음"));

        linkRoomService.inviteUser(roomId, request.userId(), user);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/invitations")
    public ResponseEntity<List<InvitationResponse>> getMyInvitations(
            @AuthenticationPrincipal SecurityUser securityUser
    ) {
        User user = userRepository.findById(securityUser.getId())
                .orElseThrow(() -> new IllegalArgumentException("유저 찾을 수 없음"));

        List<InvitationResponse> invitations = linkRoomService.getMyInvitations(user);
        return ResponseEntity.ok(invitations);
    }
    // 수락
    @PostMapping("/invitations/{roomMemberId}/accept")
    public ResponseEntity<Void> acceptInvitation(
            @PathVariable Long roomMemberId,
            @AuthenticationPrincipal SecurityUser securityUser
    ) {
        User user = userRepository.findById(securityUser.getId())
                .orElseThrow(() -> new IllegalArgumentException("유저 찾을 수 없음"));

        linkRoomService.acceptInvitation(roomMemberId, user);
        return ResponseEntity.ok().build();
    }

    // 거절
    @PostMapping("/invitations/{roomMemberId}/decline")
    public ResponseEntity<Void> declineInvitation(
            @PathVariable Long roomMemberId,
            @AuthenticationPrincipal SecurityUser securityUser
    ) {
        User user = userRepository.findById(securityUser.getId())
                .orElseThrow(() -> new IllegalArgumentException("유저 찾을 수 없음"));

        linkRoomService.declineInvitation(roomMemberId, user);
        return ResponseEntity.ok().build();
    }

    // 친구인 유저만 조회
    @GetMapping("/{roomId}/invite-friends")
    public ResponseEntity<List<InviteFriendWithStatusResponse>> getInviteFriendsWithStatus(
            @AuthenticationPrincipal SecurityUser securityUser,
            @PathVariable Long roomId
    ) {
        User user = userRepository.findById(securityUser.getId())
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없음"));

        List<InviteFriendWithStatusResponse> friends = linkRoomService.getInviteFriendsWithStatus(user, roomId);
        return ResponseEntity.ok(friends);
    }

    @GetMapping("/{roomId}/members")
    public ResponseEntity<List<RoomMemberList>> getMembers(@PathVariable Long roomId){

        List<RoomMemberList> memberLists = linkRoomService.getMembers(roomId);
        return ResponseEntity.ok(memberLists);
    }
}
