package com.project.bearlink.domain.link.service;

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
    private final Duration ttl = Duration.ofDays(120);

    private static final String PREFIX = "preview:";

    public LinkPreviewDto get(String url) {
        return redisTemplate.opsForValue().get(PREFIX + url);
    }

    public void set(String url, LinkPreviewDto preview) {
        redisTemplate.opsForValue().set(PREFIX + url, preview, ttl);
    }
}