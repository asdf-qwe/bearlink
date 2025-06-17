package com.project.bearlink.global.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.project.bearlink.domain.link.dto.LinkPreviewDto;
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

    @Value("${opengraph.api.key}")
    private String appId;

    public LinkPreviewDto fetchPreview(String url) {
        try {
            String encodedUrl = URLEncoder.encode(url, StandardCharsets.UTF_8);
            String fullUrl = "https://opengraph.io/api/1.1/site/" + encodedUrl + "?app_id=" + appId;

            URI uri = URI.create(fullUrl);

            RestTemplate rest = new RestTemplate();
            ResponseEntity<JsonNode> response = rest.getForEntity(uri, JsonNode.class);
            JsonNode og = response.getBody().path("openGraph");

            String title = og.path("title").asText(null);
            String image = og.path("image").asText(null);

            if (image == null || image.isEmpty()) {
                image = getDefaultImageForDomain(url);
            }

            return new LinkPreviewDto(title, image, null);

        } catch (Exception e) {
            log.warn("❌ OpenGraph API 실패: {}", url, e);
            return null;
        }
    }

    private String getDefaultImageForDomain(String url) {
        try {
            URI uri = new URI(url);
            String host = uri.getHost();

            if (host == null) return getFallbackImage();

            // 배포시 url 바꿔줘야 함 ex) http://bearlink.site/static/**
            if (host.contains("youtube.com")) {
                return "https://localhost:8080/thumbs/youtube-default.png";
            } else if (host.contains("naver.com")) {
                return "https://localhost:8080/thumbs/naver-default.jpeg";
            } else if (host.contains("daum.net")) {
                return "https://localhost:8080/thumbs/daum-default.png";
            } else {
                return getFallbackImage();
            }

        } catch (Exception e) {
            log.warn("🌐 도메인 파싱 실패: {}", url, e);
            return getFallbackImage();
        }
    }

    private String getFallbackImage() {
        return "https://yourdomain.com/static/thumbs/default.png";
    }
}