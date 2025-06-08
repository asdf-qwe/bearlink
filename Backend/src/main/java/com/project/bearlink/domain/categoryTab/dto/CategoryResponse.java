package com.project.bearlink.domain.categoryTab.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Getter
public class CategoryResponse{
    private Long id;
    private String name;
    private Long userId;

    // 생성자, getter, setter
}

