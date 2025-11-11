package com.project.bearlink;

import com.project.bearlink.domain.friend.dto.FriendRequestDto;
import com.project.bearlink.domain.friend.entity.FriendRequest;
import com.project.bearlink.domain.friend.entity.FriendRequestStatus;
import com.project.bearlink.domain.friend.repository.FriendRequestRepository;
import com.project.bearlink.domain.friend.service.FriendService;
import com.project.bearlink.domain.user.user.entity.User;
import com.project.bearlink.domain.user.user.repository.UserRepository;
import com.project.bearlink.global.exception.ApiException;
import com.project.bearlink.global.exception.ErrorCode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;


import java.util.Optional;
import lombok.extern.slf4j.Slf4j;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


@Slf4j
@ExtendWith(MockitoExtension.class)
public class FriendServiceUnitTest {

    @Mock
    private FriendRequestRepository friendRequestRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private FriendService friendService;

    @Captor
    private ArgumentCaptor<FriendRequest> friendRequestArgumentCaptor;

    private User requester;
    private User receiver;
    private FriendRequestDto dto;

    @BeforeEach
    void setup(){
        requester = User.builder()
                .id(1L)
                .loginId("userA")
                .nickname("Hyun")
                .email("user@test.com")
                .build();

        receiver = User.builder()
                .id(2L)
                .loginId("userB")
                .nickname("test")
                .email("test@test.com")
                .build();

        dto = new FriendRequestDto(receiver.getId());
    }

    @Test
    @DisplayName("친구 요청 성공")
    public void sendRequest_success(){

        when(friendRequestRepository.existsByRequesterIdAndReceiverIdAndStatus(
                requester.getId(), receiver.getId(), FriendRequestStatus.PENDING))
                .thenReturn(false);
        when(userRepository.findById(requester.getId())).thenReturn(Optional.of(requester));
        when(userRepository.findById(receiver.getId())).thenReturn(Optional.of(receiver));

        log.info("친구 요청 서비스 호출");
        friendService.sendRequest(requester.getId(), dto);

        verify(friendRequestRepository).save(friendRequestArgumentCaptor.capture());
        FriendRequest saved = friendRequestArgumentCaptor.getValue();
        log.info("저장된 친구 요청 = {} → {}", saved.getRequester().getNickname(), saved.getReceiver().getNickname());

        assertEquals(requester.getId(), saved.getRequester().getId());
        assertEquals(receiver.getId(), saved.getReceiver().getId());
    }

    @Test
    @DisplayName("친구 요청 실패 - 자기 자신에게 요청 불가")
    void sendRequest_fail_selfRequest() {

        FriendRequestDto dto = new FriendRequestDto(requester.getId());

        log.info("자기 자신한테 친구 요청");
        ApiException ex = assertThrows(ApiException.class, () ->
                friendService.sendRequest(requester.getId(), dto)
        );

        log.info("자기 자신한테 친구 요청 테스트 결과");
        assertEquals(ErrorCode.SELF_REQUEST_NOT_ALLOWED, ex.getErrorCode());
        verify(friendRequestRepository, never()).save(any());
    }

    @Test
    @DisplayName("친구 요청 실패 - 중복된 요청 불가")
    void sendRequest_fail_duplicate(){
        when(friendRequestRepository.existsByRequesterIdAndReceiverIdAndStatus(
                requester.getId(), receiver.getId(), FriendRequestStatus.PENDING))
                .thenReturn(true);

        log.info("중복 친구 요청");
        ApiException ex = assertThrows(ApiException.class, () ->
                friendService.sendRequest(requester.getId(), dto)
        );

        log.info("자기 자신한테 친구 요청 테스트 결과");
        assertEquals(ErrorCode.DUPLICATE_REQUEST_PENDING, ex.getErrorCode());
        verify(friendRequestRepository, never()).save(any());
    }

    @Test
    @DisplayName("친구 요청 실패 - 받는사람 검증 실패")
    void sendRequest_fail_notFoundReq() {

        FriendRequestDto dto = new FriendRequestDto(0L);

        when(friendRequestRepository.existsByRequesterIdAndReceiverIdAndStatus(anyLong(), anyLong(), any()))
                .thenReturn(false);
        when(userRepository.findById(0L)).thenReturn(Optional.empty());
        when(userRepository.findById(requester.getId())).thenReturn(Optional.of(requester));


        log.info("없는 요청자 id");
        ApiException ex = assertThrows(ApiException.class, () ->
                friendService.sendRequest(requester.getId(), dto)
        );

        log.info("없는 요청자 id 테스트 결과");
        assertEquals(ErrorCode.RECEIVER_NOT_FOUND, ex.getErrorCode());
        verify(friendRequestRepository, never()).save(any());
    }

    @Test
    @DisplayName("친구 요청 수락")
    void accept_success(){
        FriendRequest friendRequest = FriendRequest.builder()
                .requester(requester)
                .receiver(receiver)
                .status(FriendRequestStatus.PENDING)
                .build();

        when(friendRequestRepository.findByRequesterAndReceiverAndStatus(
                requester, receiver, FriendRequestStatus.PENDING))
                .thenReturn(Optional.of(friendRequest));
        when(userRepository.findById(requester.getId())).thenReturn(Optional.of(requester));
        when(userRepository.findById(receiver.getId())).thenReturn(Optional.of(receiver));

        log.info("친구 요청 수락");
        friendService.accept(requester.getId(), receiver.getId());

        log.info("친구 요청 수락 후 상태 변경");
        verify(friendRequestRepository).save(friendRequestArgumentCaptor.capture());
        FriendRequest saved = friendRequestArgumentCaptor.getValue();

        log.info("수락 후 상태 변경 검증");
        assertEquals(FriendRequestStatus.ACCEPTED, saved.getStatus());
        assertNotNull(saved.getRespondedAt());
    }

}
