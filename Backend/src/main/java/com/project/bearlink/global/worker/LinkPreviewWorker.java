package com.project.bearlink.global.worker;

import com.project.bearlink.domain.link.dto.LinkPreviewDto;
import com.project.bearlink.domain.link.entity.Link;
import com.project.bearlink.domain.link.entity.PreviewStatus;
import com.project.bearlink.domain.link.repository.LinkRepository;
import com.project.bearlink.domain.link.service.LinkPreviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class LinkPreviewWorker {

    private final RedisTemplate<String, String> redisStringTemplate;
    private final LinkPreviewProcessor processor;

    @Scheduled(fixedDelay = 10000)
    public void consumeQueue() {
        for (int i = 0; i < 5; i++) { // 병렬로 최대 5개까지 처리
            String linkIdStr = redisStringTemplate.opsForList().leftPop("link-preview-queue");
            if (linkIdStr == null) return;

            try {
                Long linkId = Long.parseLong(linkIdStr);
                processor.processLink(linkId); // 병렬 처리
            } catch (NumberFormatException e) {
                log.warn("❗ 잘못된 링크 ID 형식: {}", linkIdStr);
            }
        }
    }
}