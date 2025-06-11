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
import lombok.RequiredArgsConstructor;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
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

    public Link createLink(LinkRequestDto req, Long userId, Long categoryId) {

        User user = userRepository.findById(userId)
                .orElseThrow(()-> new IllegalArgumentException("유저를 찾을 수 없습니다"));

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(()->new IllegalArgumentException("카테고리를 찾을 수 없습니다"));

        Link link = Link.builder()
                .title(req.getTitle())
                .url(req.getUrl())
                .thumbnailImageUrl(req.getThumbnailImageUrl())
                .category(category)
                .user(user)
                .build();

        return linkRepository.save(link);

    }

    public List<LinkResponseDto> getLinks (Long userId, Long categoryId) {

        List<Link> links = linkRepository.findByCategoryUserIdAndCategoryId(userId, categoryId);

        return links.stream()
                .map(link -> new LinkResponseDto(
                        link.getId(),
                        link.getTitle(),
                        link.getUrl(),
                        link.getThumbnailImageUrl()
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

    // 사이트 별 정보 추출 사용 메서드
    public LinkPreviewDto extractLinkPreview(String url) {
        try {
            if (isYoutube(url)) {
                return extractYoutubePreview(url);
            }

            // 앞으로 여기다 다른 사이트 조건 추가 가능
            // if (isChzzk(url)) return extractChzzkPreview(url);
            // if (isMusinsa(url)) return extractMusinsaPreview(url);

            return extractGenericPreview(url); // 기본 처리

        } catch (Exception e) {
            return null;
        }
    }

    // 유튜브 추출 관련 메서드들
    private boolean isYoutube(String url) {
        return url.contains("youtube.com/watch") || url.contains("youtu.be/");
    }


    private LinkPreviewDto extractYoutubePreview(String url) throws IOException {
        String videoId = extractYoutubeVideoId(url);
        if (videoId == null) return null;

        String thumbnailUrl = "https://img.youtube.com/vi/" + videoId + "/0.jpg";

        Document doc = Jsoup.connect(url)
                .userAgent("Mozilla/5.0")
                .referrer("http://www.google.com")
                .timeout(5000)
                .get();

        String title = Optional.ofNullable(doc.selectFirst("meta[property=og:title]"))
                .map(e -> e.attr("content"))
                .orElse("제목 없음");

        return new LinkPreviewDto(title, thumbnailUrl);
    }

    private String extractYoutubeVideoId(String url) {
        try {
            URI uri = new URI(url);
            String host = uri.getHost();
            if (host == null) return null;

            if (host.contains("youtu.be")) {
                return uri.getPath().substring(1);
            }

            if (host.contains("youtube.com")) {
                String query = uri.getQuery();
                if (query == null) return null;

                return Arrays.stream(query.split("&"))
                        .filter(p -> p.startsWith("v="))
                        .map(p -> p.substring(2))
                        .findFirst()
                        .orElse(null);
            }
        } catch (Exception ignored) {}
        return null;
    }
    // 여기까지 유튜브 관련


    // 일반 사이트 썸네일 추출
    private LinkPreviewDto extractGenericPreview(String url) throws IOException {
        Document doc = Jsoup.connect(url)
                .userAgent("Mozilla/5.0")
                .referrer("http://www.google.com")
                .timeout(5000)
                .get();

        String title = Optional.ofNullable(doc.selectFirst("meta[property=og:title]"))
                .map(e -> e.attr("content"))
                .orElse("제목 없음");

        String thumbnail = Optional.ofNullable(doc.selectFirst("meta[property=og:image]"))
                .map(e -> e.attr("content"))
                .orElseGet(() ->
                        Optional.ofNullable(doc.selectFirst("meta[name=twitter:image]"))
                                .map(e -> e.attr("content"))
                                .orElseGet(() ->
                                        Optional.ofNullable(doc.selectFirst("meta[name=image]"))
                                                .map(e -> e.attr("content"))
                                                .orElseGet(() ->
                                                        Optional.ofNullable(doc.selectFirst("link[rel=icon]"))
                                                                .map(e -> e.attr("href"))
                                                                .orElse(null)
                                                )
                                )
                );

        return new LinkPreviewDto(title, thumbnail);
    }

}
