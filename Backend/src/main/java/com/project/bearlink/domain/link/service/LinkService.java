package com.project.bearlink.domain.link.service;

import com.project.bearlink.domain.category.entity.Category;
import com.project.bearlink.domain.category.repository.CategoryRepository;
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

import java.util.List;
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

    public String extractThumbnail(String url) {
        try {
            Document doc = Jsoup.connect(url).get();

            Element ogImage = doc.selectFirst("meta[property=og:image]");
            if(ogImage != null) {
                return ogImage.attr("content");
            }

            Element twitterImage = doc.selectFirst("meta[name=twitter:image]");
            if (twitterImage != null) {
                return twitterImage.attr("content");
            }

            Element metaImage = doc.selectFirst("meta[name=image]");
            if(metaImage != null) {
                return metaImage.attr("content");
            }

            Element favicon = doc.selectFirst("link[rel=icon]");
            if (favicon != null) {
                return favicon.attr("href");
            }

            return null;
        } catch (Exception e) {
            return null;
        }


    }

}
