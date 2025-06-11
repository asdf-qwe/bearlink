package com.project.bearlink.domain.link.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LinkPreviewDto {
    private String title;
    private String thumbnailImageUrl;
}