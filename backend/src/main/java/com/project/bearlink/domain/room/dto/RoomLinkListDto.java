package com.project.bearlink.domain.room.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RoomLinkListDto {
    private Long id;
    private String title;
    private String url;
}
