package com.project.bearlink.domain.friend.service;

import com.project.bearlink.domain.friend.dto.FindFriendDto;
import com.project.bearlink.domain.friend.dto.FriendRequestDto;
import com.project.bearlink.domain.friend.dto.FriendResponseDto;
import com.project.bearlink.domain.friend.entity.FriendRequest;
import com.project.bearlink.domain.friend.entity.FriendRequestStatus;
import com.project.bearlink.domain.friend.repository.FriendRequestRepository;
import com.project.bearlink.domain.user.user.entity.User;
import com.project.bearlink.domain.user.user.repository.UserRepository;
import com.project.bearlink.global.exception.ApiException;
import com.project.bearlink.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FriendService {

    private final UserRepository userRepository;
    private final FriendRequestRepository friendRequestRepository;

    @Transactional(readOnly = false)
    public void sendRequest(Long requesterId, FriendRequestDto dto) {

        if(requesterId.equals(dto.getReceiverId())){
            throw new ApiException(ErrorCode.SELF_REQUEST_NOT_ALLOWED);
        }

        if(friendRequestRepository.existsByRequesterIdAndReceiverIdAndStatus(
                requesterId,dto.getReceiverId(),FriendRequestStatus.PENDING)){
            throw new ApiException(ErrorCode.DUPLICATE_REQUEST_PENDING);
        }

        User requester = userRepository.findById(requesterId)
                .orElseThrow(()-> new ApiException(ErrorCode.REQUESTER_NOT_FOUND));

        User receiver = userRepository.findById(dto.getReceiverId())
                .orElseThrow(()-> new ApiException(ErrorCode.RECEIVER_NOT_FOUND));

        FriendRequest friendRequest = FriendRequest.builder()
                .requester(requester)
                .receiver(receiver)
                .status(FriendRequestStatus.PENDING)
                .build();

        friendRequestRepository.save(friendRequest);
    }

    @Transactional(readOnly = false)
    public void accept(Long requesterId, Long receiverId) {
        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new ApiException(ErrorCode.REQUESTER_NOT_FOUND));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new ApiException(ErrorCode.RECEIVER_NOT_FOUND));

        FriendRequest friendRequest = friendRequestRepository.findByRequesterAndReceiverAndStatus(requester, receiver, FriendRequestStatus.PENDING)
                .orElseThrow(() -> new ApiException(ErrorCode.FRIEND_REQUEST_NOT_FOUND));

        friendRequest.setStatus(FriendRequestStatus.ACCEPTED);
        friendRequest.setRespondedAt(LocalDateTime.now());
        friendRequestRepository.save(friendRequest);
    }

    @Transactional(readOnly = false)
    public void rejectRequest(Long requestId, Long receiverId) {
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new ApiException(ErrorCode.FRIEND_REQUEST_NOT_FOUND));

        if (!request.getReceiver().getId().equals(receiverId)) {
            throw new ApiException(ErrorCode.FORBIDDEN_REQUEST_ACTION);
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


    public Page<FindFriendDto> findFriends(String keyword, Long userId, Pageable pageable) {
        return userRepository.searchOnlyUnrelatedUsers(keyword, userId, pageable);
    }
}