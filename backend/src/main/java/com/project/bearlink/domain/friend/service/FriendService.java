package com.project.bearlink.domain.friend.service;

import com.project.bearlink.domain.friend.dto.FindFriendDto;
import com.project.bearlink.domain.friend.dto.FriendRequestDto;
import com.project.bearlink.domain.friend.dto.FriendResponseDto;
import com.project.bearlink.domain.friend.entity.FriendRequest;
import com.project.bearlink.domain.friend.entity.FriendRequestStatus;
import com.project.bearlink.domain.friend.repository.FriendRequestRepository;
import com.project.bearlink.domain.user.user.entity.User;
import com.project.bearlink.domain.user.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FriendService {

    private final UserRepository userRepository;
    private final FriendRequestRepository friendRequestRepository;

    public void sendRequest(Long requesterId, FriendRequestDto dto) {

        if(requesterId.equals(dto.getReceiverId())){
            throw new IllegalArgumentException("본인에게 친구 요청을 보낼 수 없음");
        }

        if(friendRequestRepository.existsByRequesterIdAndReceiverIdAndStatus(
                requesterId,dto.getReceiverId(),FriendRequestStatus.PENDING)){
            throw new IllegalArgumentException("이미 요청을 보낸 사용자 입니다");
        }

        User requester = userRepository.findById(requesterId)
                .orElseThrow(()-> new IllegalArgumentException("유저 찾을 수 없음"));

        User receiver = userRepository.findById(dto.getReceiverId())
                .orElseThrow(()-> new IllegalArgumentException("유저 찾을 수 없음"));

        FriendRequest friendRequest = FriendRequest.builder()
                .requester(requester)
                .receiver(receiver)
                .status(FriendRequestStatus.PENDING)
                .build();

        friendRequestRepository.save(friendRequest);
    }

    public void accept(Long requestId, Long receiverId){
        FriendRequest friendRequest = friendRequestRepository.findById(requestId)
                .orElseThrow(()->new IllegalArgumentException("요청이 존재하지 않습니다"));

        if (!friendRequest.getReceiver().getId().equals(receiverId)) {
            throw new SecurityException("이 요청을 수락할 수 있는 권한이 없습니다.");
        }

        friendRequest.setStatus(FriendRequestStatus.ACCEPTED);
        friendRequest.setRespondedAt(LocalDateTime.now());
        friendRequestRepository.save(friendRequest);
    }

    public void rejectRequest(Long requestId, Long receiverId) {
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("요청이 존재하지 않습니다."));

        if (!request.getReceiver().getId().equals(receiverId)) {
            throw new SecurityException("이 요청을 거절할 수 있는 권한이 없습니다.");
        }

        request.setStatus(FriendRequestStatus.REJECTED);
        request.setRespondedAt(LocalDateTime.now());
        friendRequestRepository.save(request);
    }

    public List<FriendResponseDto> getReceived(Long userId){
        return friendRequestRepository.findByReceiverIdAndStatusWithRequester(userId,FriendRequestStatus.PENDING).stream()
                .map(friendRequest -> {
                    User sender = friendRequest.getRequester();
                    return new FriendResponseDto(sender.getId(),sender.getNickname(),sender.getImageUrl());
                })
                .toList();
    }

    public List<FriendResponseDto> getFriends(Long userId) {
        return friendRequestRepository.findAcceptedFriendsWithUsers(userId).stream()
                .map(req -> {
                    User other = req.getRequester().getId().equals(userId)
                            ? req.getReceiver()
                            : req.getRequester();
                    return new FriendResponseDto(other.getId(), other.getNickname(), other.getImageUrl());
                })
                .toList();
    }

    public Page<FriendResponseDto> findFriends(String keyword, Long userId, Pageable pageable) {
        Page<User> user = userRepository.searchByNicknameExcludingCurrentUser(keyword, userId, pageable);
        return user.map(u->new FriendResponseDto(u.getId(),u.getNickname(),u.getImageUrl()));
    }
}