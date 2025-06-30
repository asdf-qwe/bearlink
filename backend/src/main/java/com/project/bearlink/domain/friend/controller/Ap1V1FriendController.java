package com.project.bearlink.domain.friend.controller;

import com.project.bearlink.domain.friend.dto.FindFriendDto;
import com.project.bearlink.domain.friend.dto.FriendRequestDto;
import com.project.bearlink.domain.friend.dto.FriendResponseDto;
import com.project.bearlink.domain.friend.service.FriendService;
import com.project.bearlink.domain.user.user.entity.User;
import com.project.bearlink.global.security.auth.SecurityUser;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/friend")
public class Ap1V1FriendController {

    private final FriendService friendService;

    @PostMapping("/request")
    public ResponseEntity<Void> sendRequest(@AuthenticationPrincipal SecurityUser user, @RequestBody FriendRequestDto dto){
        friendService.sendRequest(user.getId(), dto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/request/{requestId}/accept")
    public ResponseEntity<Void> accept(@PathVariable Long requestId, @AuthenticationPrincipal SecurityUser user){
        friendService.accept(requestId, user.getId());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/request/{requestId}/reject")
    public ResponseEntity<Void> reject(@PathVariable Long requestId, @AuthenticationPrincipal SecurityUser user){
        friendService.rejectRequest(requestId, user.getId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/requests")
    public ResponseEntity<List<FriendResponseDto>> getReceivedRequests(@AuthenticationPrincipal SecurityUser user){

        return ResponseEntity.ok(friendService.getReceived(user.getId()));
    }

    @GetMapping
    public ResponseEntity<List<FriendResponseDto>> getFriends(
            @AuthenticationPrincipal SecurityUser user) {
        return ResponseEntity.ok(friendService.getFriends(user.getId()));
    }

    @GetMapping("/find-friend")
    public ResponseEntity<Page<FriendResponseDto>> findFriend(@RequestParam String keyword,
                                                 @AuthenticationPrincipal SecurityUser user,
                                                 Pageable pageable){

        return ResponseEntity.ok(friendService.findFriends(keyword, user.getId(), pageable));
    }
}