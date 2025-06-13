package com.project.bearlink.domain.link.service;

import com.project.bearlink.domain.link.dto.LinkPreviewDto;
import com.project.bearlink.global.api.OpenGraphApiClient;
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
    private final OpenGraphApiClient openGraphApiClient;

    public LinkPreviewDto extract(String url) {
        String cacheKey = "preview:" + url;

        LinkPreviewDto cached = cache.get(cacheKey);
        if (cached != null) return cached;

        LinkPreviewDto preview;
        if (isYoutube(url)) {
            preview = youtubeApiClient.fetchPreview(url);
        } else {
            preview = openGraphApiClient.fetchPreview(url);
        }

        if (preview != null) {
            cache.set(cacheKey, preview);
        }

        return preview;
    }

    private boolean isYoutube(String url) {
        return url.contains("youtube.com/watch") || url.contains("youtu.be");
    }
}