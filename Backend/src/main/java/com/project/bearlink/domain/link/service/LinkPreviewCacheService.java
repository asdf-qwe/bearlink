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

    public LinkPreviewDto get(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    public void set(String key, LinkPreviewDto preview) {
        redisTemplate.opsForValue().set(key, preview, ttl);
    }
}