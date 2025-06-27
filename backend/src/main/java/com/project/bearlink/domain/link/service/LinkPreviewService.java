package com.project.bearlink.domain.link.service;

import com.project.bearlink.domain.link.dto.LinkPreviewDto;
import com.project.bearlink.global.api.YoutubeApiClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

// 3. 메인 미리보기 추출 서비스
@Service
@RequiredArgsConstructor
@Slf4j
public class LinkPreviewService {

    private final LinkPreviewCacheService cache;
    private final YoutubeApiClient youtubeApiClient;

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
                preview = extractLinkPreview(url);

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

    public LinkPreviewDto extractLinkPreview(String url) {
        try {
            String image = getFixedFaviconForUrl(url);

            return new LinkPreviewDto(null, image);

        } catch (Exception e) {
            log.warn("❌ OpenGraph API 실패: {}", url, e);
            return null;
        }
    }

    public String getFixedFaviconForUrl(String url) {
        if (url.contains("naver.com")) {
            return "https://ssl.pstatic.net/sstatic/search/common/og_v3.png";
        } else if (url.contains("kakao.com")) {
            return "https://www.kakaocorp.com/favicon.ico";
        } else if (url.contains("google.com")) {
            return "https://www.google.com/favicon.ico";
        } else if (url.contains("coupang.com")) {
            return "https://image10.coupangcdn.com/image/op/displayitem/displayitem_coupang.png";
        } else if (url.contains("github.com")) {
            return "https://github.githubassets.com/favicons/favicon-dark.png";
        }
        // fallback
        return null;
    }


}