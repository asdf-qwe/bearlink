package com.project.bearlink.domain.room.dto;

public record InviteFriendWithStatusResponse(
        Long userId,
        String nickname,
        String email,
        String invitationStatus // NOT_INVITED, INVITED, ACCEPTED, DECLINED
) {}