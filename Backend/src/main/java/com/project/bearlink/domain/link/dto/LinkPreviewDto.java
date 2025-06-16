package com.project.bearlink.domain.link.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LinkPreviewDto {
    private String title;
    private String thumbnailImageUrl;
    private String price;
}
