package com.project.bearlink.domain.category.controller;

import com.project.bearlink.domain.category.dto.CategoryRequest;
import com.project.bearlink.domain.category.dto.CategoryResponse;
import com.project.bearlink.domain.category.entity.Category;
import com.project.bearlink.domain.category.service.CategoryService;
import com.project.bearlink.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/category")
@RequiredArgsConstructor
public class ApiV1CategoryController {
    private final CategoryService categoryService;


    @PostMapping
    public ResponseEntity<ApiResponse<String>> createCategory (@RequestBody CategoryRequest req,
                                               @RequestParam Long userId) {
        Category category = categoryService.createCategory(req, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("생성 완료"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> readCategory (@RequestParam Long userId) {
        List<CategoryResponse> categories = categoryService.getCategoriesByUserId(userId);
        return ResponseEntity.ok(ApiResponse.ok(categories));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<String>> updateCategory(@RequestBody CategoryRequest req, @RequestParam Long categoryId) {
        Category category = categoryService.updateCategory(req, categoryId);
        return ResponseEntity.ok(ApiResponse.ok("수정 완료"));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<String>> deleteCategory(@RequestParam Long categoryId) {
        categoryService.deleteCategory(categoryId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(ApiResponse.ok("삭제 되었습니다"));
    }
}
