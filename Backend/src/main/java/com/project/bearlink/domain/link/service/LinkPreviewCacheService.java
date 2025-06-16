package com.project.bearlink.domain.link.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.bearlink.domain.link.dto.LinkPreviewDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

// 2. Redis 캐시 서비스
@Service
@RequiredArgsConstructor
public class LinkPreviewCacheService {

    private final RedisTemplate<String, LinkPreviewDto> redisTemplate;
    private final ObjectMapper objectMapper; // ⭐ 주입 추가
    private final Duration ttl = Duration.ofDays(120);

    private static final String PREFIX = "preview:";

    public LinkPreviewDto get(String url) {
        Object raw = redisTemplate.opsForValue().get(PREFIX + url);
        if (raw == null) return null;

        return objectMapper.convertValue(raw, LinkPreviewDto.class); // ⭐ 명시적 변환
    }

    public void set(String url, LinkPreviewDto preview) {
        redisTemplate.opsForValue().set(PREFIX + url, preview, ttl);
    }
}