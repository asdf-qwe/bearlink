package com.project.bearlink.domain.category.controller;

import com.project.bearlink.domain.category.dto.CategoryRequest;
import com.project.bearlink.domain.category.dto.CategoryResponse;
import com.project.bearlink.domain.category.entity.Category;
import com.project.bearlink.domain.category.service.CategoryService;
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
        Category category = categoryService.createCategory(req, userId);
        return ResponseEntity.ok("카테고리 생성 " + category);
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> readCategory (@RequestParam Long userId) {
        List<CategoryResponse> categories = categoryService.getCategoriesByUserId(userId);
        return ResponseEntity.ok(categories);
    }

    @PutMapping
    public ResponseEntity<String> updateCategory(@RequestBody CategoryRequest req, @RequestParam Long categoryId) {
        Category category = categoryService.updateCategory(req, categoryId);
        return ResponseEntity.ok("수정 완료 " + category);
    }

    @DeleteMapping
    public ResponseEntity<String> deleteCategory(@RequestParam Long categoryId) {
        categoryService.deleteCategory(categoryId);
        return ResponseEntity.ok("삭제 되었습니다");
    }
}
