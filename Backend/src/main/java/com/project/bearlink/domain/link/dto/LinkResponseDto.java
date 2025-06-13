package com.project.bearlink.domain.link.dto;

import com.project.bearlink.domain.category.entity.Category;
import com.project.bearlink.domain.link.entity.PreviewStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LinkResponseDto {
    private Long id;
    private String title;
    private String url;
    private String thumbnailImageUrl;
    private String price;
    private PreviewStatus previewStatus;
}
