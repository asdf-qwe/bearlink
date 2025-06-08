package com.project.bearlink.domain.categoryTab.controller;

import com.project.bearlink.domain.categoryTab.dto.CategoryRequest;
import com.project.bearlink.domain.categoryTab.dto.CategoryResponse;
import com.project.bearlink.domain.categoryTab.entity.Category;
import com.project.bearlink.domain.categoryTab.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/category")
@RequiredArgsConstructor
public class ApiV1CategoryController {
    private final CategoryService categoryService;


    @PostMapping
    public ResponseEntity<String> createCategory (@RequestBody CategoryRequest req,
                                               @RequestParam Long userId) {
        Category Category = categoryService.createCategory(req, userId);
        return ResponseEntity.ok("카테고리 생성");
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> readCategory (@RequestParam Long userId) {
        List<CategoryResponse> categories = categoryService.getCategoriesByUserId(userId);
        return ResponseEntity.ok(categories);
    }

    @DeleteMapping
    public ResponseEntity<String> deleteCategory(@RequestParam Long categoryId) {
        categoryService.deleteCategory(categoryId);
        return ResponseEntity.ok("삭제 되었습니다");
    }
}
