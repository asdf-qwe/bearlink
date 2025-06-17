package com.project.bearlink.global.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.project.bearlink.domain.link.dto.LinkPreviewDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;
import java.net.URI;
import java.util.Arrays;

// 6. YouTube API Client (예: 공식 API 사용)
@Component
@Slf4j
public class YoutubeApiClient {
    @Value("${youtube.api.key}")
    private String apiKey;

    public LinkPreviewDto fetchPreview(String url) {
        String videoId = extractVideoId(url);
        if (videoId == null) return null;

        String api = "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + videoId + "&key=" + apiKey;
        try {
            RestTemplate rest = new RestTemplate();
            ResponseEntity<JsonNode> response = rest.getForEntity(api, JsonNode.class);
            JsonNode item = response.getBody().path("items").get(0).path("snippet");

            String title = item.path("title").asText(null);
            String thumbnail = item.path("thumbnails").path("high").path("url").asText(null);
            return new LinkPreviewDto(title, thumbnail, null);
        } catch (Exception e) {
            log.warn("유튜브 API 실패: {}", url);
            return null;
        }
    }

    private String extractVideoId(String url) {
        try {
            URI uri = new URI(url);
            if (uri.getHost().contains("youtu.be")) return uri.getPath().substring(1);
            if (uri.getHost().contains("youtube.com")) {
                String query = uri.getQuery();
                if (query == null) return null;
                return Arrays.stream(query.split("&"))
                        .filter(s -> s.startsWith("v="))
                        .map(s -> s.substring(2))
                        .findFirst().orElse(null);
            }
        } catch (Exception ignored) {}
        return null;
    }
}
