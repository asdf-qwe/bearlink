package com.project.bearlink.domain.room.controller;

import com.project.bearlink.domain.room.dto.*;
import com.project.bearlink.domain.room.entity.LinkRoom;
import com.project.bearlink.domain.room.service.RoomService;
import com.project.bearlink.domain.user.user.entity.User;
import com.project.bearlink.domain.user.user.repository.UserRepository;
import com.project.bearlink.global.exception.ApiException;
import com.project.bearlink.global.exception.ErrorCode;
import com.project.bearlink.global.response.ApiResponse;
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
    public ResponseEntity<ApiResponse<CreateLinkRoomResponse>> createRoom(
            @RequestBody CreateLinkRoomRequest request,
            @AuthenticationPrincipal SecurityUser securityUser
    ) {
        User user = userRepository.findById(securityUser.getId())
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));

        CreateLinkRoomResponse response = linkRoomService.createRoom(request, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RoomsDto>>> getRooms(@AuthenticationPrincipal SecurityUser user){

        return ResponseEntity.ok(ApiResponse.ok(linkRoomService.getRooms(user.getId())));
    }

    @GetMapping("/links")
    public ResponseEntity<ApiResponse<List<RoomLinkListDto>>> getRoomLinks(@AuthenticationPrincipal SecurityUser user,
                                                              @RequestParam Long roomId){
        List<RoomLinkListDto> links = linkRoomService.getRoomLinks(user.getId(), roomId);
        return ResponseEntity.ok(ApiResponse.ok(links));
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<ApiResponse<RoomsDto>> getRoom(@PathVariable Long roomId) {
        RoomsDto linkRoom = linkRoomService.getRoom(roomId);

        return ResponseEntity.ok(ApiResponse.ok(linkRoom));
    }

    @PostMapping("/{roomId}/invite")
    public ResponseEntity<ApiResponse<Void>> inviteUser(
            @PathVariable Long roomId,
            @RequestBody RoomInviteRequest request,
            @AuthenticationPrincipal SecurityUser securityUser
    ) {
        User user = userRepository.findById(securityUser.getId())
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));

        linkRoomService.inviteUser(roomId, request.userId(), user);
        return ResponseEntity.ok(ApiResponse.ok());
    }

    @GetMapping("/invitations")
    public ResponseEntity<ApiResponse<List<InvitationResponse>>> getMyInvitations(
            @AuthenticationPrincipal SecurityUser securityUser
    ) {
        User user = userRepository.findById(securityUser.getId())
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));

        List<InvitationResponse> invitations = linkRoomService.getMyInvitations(user);
        return ResponseEntity.ok(ApiResponse.ok(invitations));
    }

    @PostMapping("/invitations/{roomMemberId}/accept")
    public ResponseEntity<ApiResponse<Void>> acceptInvitation(
            @PathVariable Long roomMemberId,
            @AuthenticationPrincipal SecurityUser securityUser
    ) {
        User user = userRepository.findById(securityUser.getId())
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));

        linkRoomService.acceptInvitation(roomMemberId, user);
        return ResponseEntity.ok(ApiResponse.ok());
    }


    @PostMapping("/invitations/{roomMemberId}/decline")
    public ResponseEntity<ApiResponse<Void>> declineInvitation(
            @PathVariable Long roomMemberId,
            @AuthenticationPrincipal SecurityUser securityUser
    ) {
        User user = userRepository.findById(securityUser.getId())
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));

        linkRoomService.declineInvitation(roomMemberId, user);
        return ResponseEntity.ok(ApiResponse.ok());
    }


    @GetMapping("/{roomId}/invite-friends")
    public ResponseEntity<ApiResponse<List<InviteFriendWithStatusResponse>>> getInviteFriendsWithStatus(
            @AuthenticationPrincipal SecurityUser securityUser,
            @PathVariable Long roomId
    ) {
        User user = userRepository.findById(securityUser.getId())
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));

        List<InviteFriendWithStatusResponse> friends = linkRoomService.getInviteFriendsWithStatus(user, roomId);
        return ResponseEntity.ok(ApiResponse.ok(friends));
    }

    @GetMapping("/{roomId}/members")
    public ResponseEntity<ApiResponse<List<RoomMemberList>>> getMembers(@PathVariable Long roomId){

        List<RoomMemberList> memberLists = linkRoomService.getMembers(roomId);
        return ResponseEntity.ok(ApiResponse.ok(memberLists));
    }

    @DeleteMapping
    public void deleteRoom(@RequestParam Long roomId){
        linkRoomService.deleteRooms(roomId);
    }
}
