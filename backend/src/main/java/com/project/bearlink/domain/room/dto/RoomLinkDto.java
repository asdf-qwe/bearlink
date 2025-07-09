package com.project.bearlink.domain.room.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomLinkDto {
    private String title;
    private String url;
    private String thumbnailImageUrl;
}