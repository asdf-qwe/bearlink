package com.project.bearlink.domain.categoryTab.service;

import com.project.bearlink.domain.categoryTab.dto.CategoryRequest;
import com.project.bearlink.domain.categoryTab.entity.Category;
import com.project.bearlink.domain.categoryTab.repository.CategoryRepository;
import com.project.bearlink.domain.user.user.entity.User;
import com.project.bearlink.domain.user.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    //기본 카테고리 생성
    public Category createCategory(CategoryRequest req, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저가 존재하지 않습니다."));

        Category category = Category.builder()
                .name(req.getName())
                .user(user)
                .build();

        return categoryRepository.save(category);
    }

    // 기본 특정 카테고리 조회 (메뉴중 하나 클릭하면 상세 페이지로 이동)
    public Category readCategory(Long categoryId) {

        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다"));
    }

    // 특정 사용자의 카테고리 목록 조회 (사이드바 메뉴로 보여줄 리스트)
    public List<Category> getCategoriesByUserId(long userId) {

        return categoryRepository.findByUserId(userId);
    }

    public Category updateCategory (CategoryRequest req, Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(()-> new IllegalArgumentException("카테고리가 없습니다"));

        category.setName(req.getName());

        return categoryRepository.save(category);
    }

    public void deleteCategory (Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(()-> new IllegalArgumentException("카테고리가 없습니다"));

        categoryRepository.delete(category);
    }

}
