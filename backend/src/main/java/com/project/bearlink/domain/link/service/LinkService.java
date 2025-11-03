package com.project.bearlink.domain.link.service;

import com.project.bearlink.domain.category.entity.Category;
import com.project.bearlink.domain.category.repository.CategoryRepository;
import com.project.bearlink.domain.link.dto.LinkPreviewDto;
import com.project.bearlink.domain.link.dto.LinkRequestDto;
import com.project.bearlink.domain.link.dto.LinkResponseDto;
import com.project.bearlink.domain.link.dto.LinkUpdateDto;
import com.project.bearlink.domain.link.entity.Link;
import com.project.bearlink.domain.link.repository.LinkRepository;
import com.project.bearlink.domain.user.user.entity.User;
import com.project.bearlink.domain.user.user.repository.UserRepository;
import com.project.bearlink.global.exception.ApiException;
import com.project.bearlink.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.net.URI;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LinkService {
    private final LinkRepository linkRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final RedisTemplate<String, String> redisStringTemplate;

    @Transactional(readOnly = false)
    public Link createLink(LinkRequestDto req, Long userId, Long categoryId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ApiException(ErrorCode.CATEGORY_NOT_FOUND));

        Link link = Link.builder()
                .title(req.getTitle())
                .url(req.getUrl())
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
                        link.getUrl()
                ))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = false)
    public Link updateTitle (Long linkId, LinkUpdateDto dto) {
        Link link = linkRepository.findById(linkId)
                        .orElseThrow(()-> new ApiException(ErrorCode.LINK_NOT_FOUND));

        link.setTitle(dto.getTitle());
        return linkRepository.save(link);
    }

    @Transactional(readOnly = false)
    public void deleteLink (Long linkId) {
        Link link = linkRepository.findById(linkId)
                .orElseThrow(()->new ApiException(ErrorCode.LINK_NOT_FOUND));
        linkRepository.delete(link);
    }

    public List<String> getYoutubeVideoIds(Long userId, Long categoryId) {
        return linkRepository.findYoutubeLinksByUserAndCategory(userId, categoryId).stream()
                .map(Link::getUrl)
                .map(this::extractYoutubeVideoId)
                .filter(Objects::nonNull)
                .toList();
    }

    private String extractYoutubeVideoId(String url) {

        try {
            URI uri = new URI(url);
            String host = uri.getHost();
            if (host.contains("youtube.com")) {
                String query = uri.getQuery();
                if (query != null && query.contains("v=")) {
                    return Arrays.stream(query.split("&"))
                            .filter(p -> p.startsWith("v="))
                            .map(p -> p.substring(2))
                            .findFirst()
                            .orElse(null);
                }
            } else if (host.contains("youtu.be")) {
                return uri.getPath().substring(1); // /Dmt2dzRCA0
            }
        } catch (Exception e) {

        }
        return null;
    }


}

