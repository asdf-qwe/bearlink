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
            String encodedUrl = URLEncoder.encode(url, StandardCharsets.UTF_8); // 한 번만 인코딩
            String fullUrl = "https://opengraph.io/api/1.1/site/" + encodedUrl + "?app_id=" + appId;

            URI uri = URI.create(fullUrl);  // 이미 인코딩됐기 때문에 따로 UriBuilder 필요 없음

            RestTemplate rest = new RestTemplate();
            ResponseEntity<JsonNode> response = rest.getForEntity(uri, JsonNode.class);
            JsonNode og = response.getBody().path("openGraph");

            String title = og.path("title").asText(null);
            String image = og.path("image").asText(null);
            return new LinkPreviewDto(title, image, null);

        } catch (Exception e) {
            log.warn("❌ OpenGraph API 실패: {}", url, e);
            return null;
        }
    }
}