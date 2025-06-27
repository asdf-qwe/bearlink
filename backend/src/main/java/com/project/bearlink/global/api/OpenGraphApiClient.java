package com.project.bearlink.global.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.project.bearlink.domain.link.dto.LinkPreviewDto;
import com.project.bearlink.domain.link.dto.LinkRequestDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

// 5. OpenGraph API Client (단순 HTTP 클라이언트)
@Component
@Slf4j
public class OpenGraphApiClient {

    public LinkPreviewDto fetchPreview(String url) {
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

    public String getFixedTitleForUrl(String url) {
        if (url.contains("naver.com")) {
            return "네이버";
        } else if (url.contains("kakao.com")) {
            return "카카오";
        } else if (url.contains("google.com")) {
            return "구글";
        } else if (url.contains("youtube.com")) {
            return "유튜브";
        } else if (url.contains("instagram.com")) {
            return "인스타그램";
        }

        return null; // fallback
    }

    private String getDefaultImage() {
        return "https://yourdomain.com/static/thumbs/default.png";
    }



}




