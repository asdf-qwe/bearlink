package com.project.bearlink.domain.category.service;

import com.project.bearlink.domain.category.dto.CategoryRequest;
import com.project.bearlink.domain.category.dto.CategoryResponse;
import com.project.bearlink.domain.category.entity.Category;
import com.project.bearlink.domain.category.repository.CategoryRepository;
import com.project.bearlink.domain.link.entity.Link;
import com.project.bearlink.domain.link.repository.LinkRepository;
import com.project.bearlink.domain.user.user.entity.User;
import com.project.bearlink.domain.user.user.repository.UserRepository;
import com.project.bearlink.global.exception.ApiException;
import com.project.bearlink.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final LinkRepository linkRepository;


    @Transactional(readOnly = false)
    public Category createCategory(CategoryRequest req, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));

        Category category = Category.builder()
                .name(req.getName())
                .user(user)
                .build();

        return categoryRepository.save(category);
    }


    public Category readCategory(Long categoryId) {

        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ApiException(ErrorCode.CATEGORY_NOT_FOUND));
    }


    public List<CategoryResponse> getCategoriesByUserId(Long userId) {
        List<Category> categories = categoryRepository.findByUserId(userId);
        return categories.stream()
                .map(category -> new CategoryResponse(
                        category.getId(),
                        category.getName(),
                        category.getUser().getId()
                ))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = false)
    public Category updateCategory (CategoryRequest req, Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(()-> new ApiException(ErrorCode.CATEGORY_NOT_FOUND));

        category.setName(req.getName());

        return categoryRepository.save(category);
    }

    @Transactional(readOnly = false)
    public void deleteCategory (Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(()-> new ApiException(ErrorCode.CATEGORY_NOT_FOUND));
        List<Link> links = linkRepository.findByCategoryId(categoryId);

        linkRepository.deleteAll(links);
        categoryRepository.delete(category);
    }

}
