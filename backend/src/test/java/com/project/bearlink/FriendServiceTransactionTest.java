package com.project.bearlink;

import com.project.bearlink.domain.friend.dto.FriendRequestDto;
import com.project.bearlink.domain.friend.repository.FriendRequestRepository;
import com.project.bearlink.domain.friend.service.FriendService;
import com.project.bearlink.domain.user.user.entity.User;
import com.project.bearlink.domain.user.user.entity.UserRole;
import com.project.bearlink.domain.user.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
class FriendServiceTransactionTest {

    @Autowired
    private FriendService friendService;

    @Autowired
    private FriendRequestRepository friendRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void sendRequest_shouldRollback_whenDuplicateRequest() {
        // given
        User userA = userRepository.save(User.builder()
                .loginId("userA")
                .password("test1234")
                .nickname("HyunA")
                .email("userA@test.com")
                .role(UserRole.USER)
                .build());

        User userB = userRepository.save(User.builder()
                .loginId("userB")
                .password("test1234")
                .nickname("HyunB")
                .email("userB@test.com")
                .role(UserRole.USER)
                .build());

        FriendRequestDto dto = new FriendRequestDto(userB.getId());

        System.out.println("\n 첫 번째 친구 요청: 정상적으로 수행되어야 합니다.");
        friendService.sendRequest(userA.getId(), dto);

        // when
        System.out.println("\n 두 번째 친구 요청: 중복 요청 예외가 발생해야 합니다.");
        assertThrows(IllegalArgumentException.class, () -> {
            friendService.sendRequest(userA.getId(), dto);
        });

        // then
        long count = friendRequestRepository.count();
        System.out.println("\n DB에 남은 friend_request 수 = " + count);

        assertEquals(1, count);

        System.out.println("\n 테스트 완료: 트랜잭션 롤백이 정상적으로 동작했습니다.\n");
    }
}