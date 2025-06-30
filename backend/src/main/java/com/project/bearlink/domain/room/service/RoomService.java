package com.project.bearlink.domain.room.service;

import com.project.bearlink.domain.room.dto.CreateRoomDto;
import com.project.bearlink.domain.room.dto.LinkRoomListDto;
import com.project.bearlink.domain.room.entity.LinkRoom;
import com.project.bearlink.domain.room.entity.RoomMember;
import com.project.bearlink.domain.room.entity.RoomRole;
import com.project.bearlink.domain.room.repository.LinkRoomRepository;
import com.project.bearlink.domain.room.repository.RoomMemberRepository;
import com.project.bearlink.domain.user.user.entity.User;
import com.project.bearlink.domain.user.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomService {
    private final LinkRoomRepository roomRepository;
    private final UserRepository userRepository;
    private final RoomMemberRepository roomMemberRepository;

    public void createRoom(CreateRoomDto dto, Long userId){
        User user = userRepository.findById(userId)
                .orElseThrow(()-> new IllegalArgumentException("유저를 찾을 수 없습니다"));


        LinkRoom linkRoom = LinkRoom.builder()
                .name(dto.getName())
                .owner(user)
                .memberCount(dto.getMembers().size()+1)
                .build();

        roomRepository.save(linkRoom);

        RoomMember ownerMember = new RoomMember();
        ownerMember.setRoom(linkRoom);
        ownerMember.setUser(user);
        ownerMember.setRole(RoomRole.OWNER);

        roomMemberRepository.save(ownerMember);


        for (Long friendId : dto.getMembers()) {
            User friend = userRepository.findById(friendId)
                    .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다"));

            RoomMember member = new RoomMember();
            member.setRoom(linkRoom);
            member.setUser(friend);
            member.setRole(RoomRole.MEMBER);
            roomMemberRepository.save(member);
        }
    }

    public List<LinkRoomListDto> getRooms(Long userId){
        List<LinkRoom> rooms = roomRepository.findAllRoomsParticipatedByUser(userId);
        return rooms.stream()
                .map(linkRoom -> new LinkRoomListDto(
                        linkRoom.getName(),
                        linkRoom.getMemberCount()
                ))
                .collect(Collectors.toList());
    }


}
