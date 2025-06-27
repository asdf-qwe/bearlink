package com.project.bearlink.domain.link.service;

import com.project.bearlink.domain.category.entity.Category;
import com.project.bearlink.domain.category.repository.CategoryRepository;
import com.project.bearlink.domain.link.dto.LinkPreviewDto;
import com.project.bearlink.domain.link.dto.LinkRequestDto;
import com.project.bearlink.domain.link.dto.LinkResponseDto;
import com.project.bearlink.domain.link.dto.LinkUpdateDto;
import com.project.bearlink.domain.link.entity.Link;
import com.project.bearlink.domain.link.entity.PreviewStatus;
import com.project.bearlink.domain.link.repository.LinkRepository;
import com.project.bearlink.domain.user.user.entity.User;
import com.project.bearlink.domain.user.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class LinkService {
    private final LinkRepository linkRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final LinkPreviewService linkPreviewService;
    private final RedisTemplate<String, String> redisStringTemplate;

    public Link createLink(LinkRequestDto req, Long userId, Long categoryId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다"));

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다"));

        LinkPreviewDto preview = linkPreviewService.extract(req.getUrl());

        Link link = Link.builder()
                .title(req.getTitle())
                .url(req.getUrl())
                .thumbnailImageUrl(preview.getThumbnailImageUrl())
                .category(category)
                .user(user)
                .build();

        return linkRepository.save(link);
    }


    public List<LinkResponseDto> getLinks(Long userId, Long categoryId) {
        List<Link> links = linkRepository.findByCategoryUserIdAndCategoryId(userId, categoryId);

        return links.stream()
                .map(link -> new LinkResponseDto(
                        link.getId(),
                        link.getTitle(),
                        link.getUrl(),
                        link.getThumbnailImageUrl(),
                        link.getPrice()
                ))
                .collect(Collectors.toList());
    }

    public Link updateTitle (Long linkId, LinkUpdateDto dto) {
        Link link = linkRepository.findById(linkId)
                        .orElseThrow(()-> new IllegalArgumentException("링크를 찾을 수 없습니다"));

        link.setTitle(dto.getTitle());
        return linkRepository.save(link);
    }

    public void deleteLink (Long linkId) {
        Link link = linkRepository.findById(linkId)
                .orElseThrow(()->new IllegalArgumentException("링크를 찾을 수 없습니다"));
        linkRepository.delete(link);
    }

}
