package com.project.bearlink.domain.link.dto;

import com.project.bearlink.domain.category.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LinkResponseDto {
    private String title;
    private String url;
    private String thumbnailImageUrl;
}
