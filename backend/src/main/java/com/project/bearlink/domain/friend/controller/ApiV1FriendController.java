package com.project.bearlink.domain.friend.controller;

import com.project.bearlink.domain.friend.dto.FindFriendDto;
import com.project.bearlink.domain.friend.dto.FriendRequestDto;
import com.project.bearlink.domain.friend.dto.FriendResponseDto;
import com.project.bearlink.domain.friend.service.FriendService;
import com.project.bearlink.domain.user.user.entity.User;
import com.project.bearlink.global.response.ApiResponse;
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
public class ApiV1FriendController {

    private final FriendService friendService;

    @PostMapping("/request")
    public ResponseEntity<ApiResponse<Void>> sendRequest(@AuthenticationPrincipal SecurityUser user, @RequestBody FriendRequestDto dto){
        friendService.sendRequest(user.getId(), dto);
        return ResponseEntity.ok(ApiResponse.ok());
    }

    @PostMapping("/request/{requestId}/accept")
    public ResponseEntity<ApiResponse<Void>> accept(@PathVariable Long requestId, @AuthenticationPrincipal SecurityUser user){
        friendService.accept(requestId, user.getId());
        return ResponseEntity.ok(ApiResponse.ok());
    }

    @PostMapping("/request/{requestId}/reject")
    public ResponseEntity<ApiResponse<Void>> reject(@PathVariable Long requestId, @AuthenticationPrincipal SecurityUser user){
        friendService.rejectRequest(requestId, user.getId());
        return ResponseEntity.ok(ApiResponse.ok());
    }

    @GetMapping("/requests")
    public ResponseEntity<ApiResponse<List<FriendResponseDto>>> getReceivedRequests(@AuthenticationPrincipal SecurityUser user){

        return ResponseEntity.ok(ApiResponse.ok(friendService.getReceived(user.getId())));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FriendResponseDto>>> getFriends(
            @AuthenticationPrincipal SecurityUser user) {
        return ResponseEntity.ok(ApiResponse.ok(friendService.getReceived(user.getId())));
    }

    @GetMapping("/find-friend")
    public ResponseEntity<ApiResponse<Page<FindFriendDto>>> findFriend(
            @RequestParam String keyword,
            @AuthenticationPrincipal SecurityUser user,
            Pageable pageable) {

        Page<FindFriendDto> result = friendService.findFriends(keyword, user.getId(), pageable);

        Page<FindFriendDto> response = result.map(f ->
                new FindFriendDto(f.id(), f.nickname(), f.imageUrl(), f.status())
        );

        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}