package com.project.bearlink.global.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.project.bearlink.domain.link.dto.LinkPreviewDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;

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
            String api = "https://opengraph.io/api/1.1/site/" + encodedUrl + "?app_id=" + appId;

            RestTemplate rest = new RestTemplate();
            ResponseEntity<JsonNode> response = rest.getForEntity(api, JsonNode.class);
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