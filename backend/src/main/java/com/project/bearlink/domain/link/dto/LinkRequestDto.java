package com.project.bearlink.domain.link.dto;

import com.project.bearlink.domain.category.entity.Category;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LinkRequestDto {
    private String title;
    private String url;
}
