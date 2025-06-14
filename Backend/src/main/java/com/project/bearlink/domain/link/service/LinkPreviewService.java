package com.project.bearlink.domain.link.service;

import com.project.bearlink.domain.link.dto.LinkPreviewDto;
import com.project.bearlink.global.api.OpenGraphApiClient;
import com.project.bearlink.global.api.YoutubeApiClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Optional;

// 3. 메인 미리보기 추출 서비스
@Service
@RequiredArgsConstructor
@Slf4j
public class LinkPreviewService {

    private final LinkPreviewCacheService cache;
    private final YoutubeApiClient youtubeApiClient;
    private final OpenGraphApiClient openGraphApiClient;

    public LinkPreviewDto extract(String url) {
        // 1. 캐시 먼저 확인
        LinkPreviewDto cached = cache.get(url);
        if (cached != null) return cached;

        LinkPreviewDto preview = null;

        try {
            // 2. YouTube 처리
            if (isYoutube(url)) {
                preview = youtubeApiClient.fetchPreview(url);
            } else {
                // 3. 일반 OpenGraph API 시도
                preview = openGraphApiClient.fetchPreview(url);

                // 4. OpenGraph API 실패 시 Jsoup fallback 시도
                if (preview == null || preview.getThumbnailImageUrl() == null) {
                    preview = extractGenericPreview(url);
                }
            }

            // 5. 캐시에 저장
            if (preview != null) {
                cache.set(url, preview);
            }

        } catch (Exception e) {
            log.warn("❌ 미리보기 추출 실패: {}", url, e);
        }

        return preview;
    }

    private boolean isYoutube(String url) {
        return url.contains("youtube.com/watch") || url.contains("youtu.be");
    }

    private LinkPreviewDto extractGenericPreview(String url) throws IOException {
        Document doc = Jsoup.connect(url)
                .userAgent("Mozilla/5.0")
                .referrer("http://www.google.com")
                .timeout(5000)
                .get();

        String title = Optional.ofNullable(doc.selectFirst("meta[property=og:title]"))
                .map(e -> e.attr("content"))
                .orElse(doc.title());

        String thumbnail = Optional.ofNullable(doc.selectFirst("meta[property=og:image]"))
                .map(e -> e.attr("content"))
                .orElseGet(() ->
                        Optional.ofNullable(doc.selectFirst("meta[name=twitter:image]"))
                                .map(e -> e.attr("content"))
                                .orElseGet(() ->
                                        Optional.ofNullable(doc.selectFirst("link[rel=icon]"))
                                                .map(e -> e.attr("href"))
                                                .orElse(null)
                                )
                );

        return new LinkPreviewDto(title, thumbnail, null);
    }
}