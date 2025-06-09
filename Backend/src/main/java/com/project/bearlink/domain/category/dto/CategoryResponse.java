package com.project.bearlink.domain.category.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class CategoryResponse{
    private Long id;
    private String name;
    private Long userId;

    // 생성자, getter, setter
}

