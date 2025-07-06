package com.project.bearlink.domain.room.dto;

public record InvitationResponse(
        Long roomMemberId,
        Long roomId
) {}