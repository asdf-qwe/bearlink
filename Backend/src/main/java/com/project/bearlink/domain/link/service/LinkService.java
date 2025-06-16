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
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.time.Duration;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LinkService {
    private final LinkRepository linkRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final RedisTemplate<String, String> redisStringTemplate;

    public Link createLink(LinkRequestDto req, Long userId, Long categoryId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다"));

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다"));

        Link link = Link.builder()
                .title(req.getTitle() != null && !req.getTitle().isBlank() ? req.getTitle() : null)
                .url(req.getUrl())
                .category(category)
                .user(user)
                .previewStatus(PreviewStatus.PENDING)
                .build();

        Link savedLink = linkRepository.save(link);

        // ✅ 동일 URL 중복 큐 등록 방지
        String processingKey = "preview:processing:" + savedLink.getUrl();
        Boolean alreadyQueued = redisStringTemplate.hasKey(processingKey);

        if (!Boolean.TRUE.equals(alreadyQueued)) {
            // 중복 큐 등록 방지 키 저장 (TTL 10분 등)
            redisStringTemplate.opsForValue().set(processingKey, "1", Duration.ofMinutes(10));
            redisStringTemplate.opsForList().rightPush("link-preview-queue", savedLink.getId().toString());
        }

        return savedLink;
    }



    public List<LinkResponseDto> getLinks(Long userId, Long categoryId) {
        List<Link> links = linkRepository.findByCategoryUserIdAndCategoryId(userId, categoryId);

        return links.stream()
                .map(link -> new LinkResponseDto(
                        link.getId(),
                        link.getTitle(),
                        link.getUrl(),
                        link.getThumbnailImageUrl(),
                        link.getPrice(),
                        link.getPreviewStatus()
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
