package com.project.bearlink.global.worker;

import com.project.bearlink.domain.link.dto.LinkPreviewDto;
import com.project.bearlink.domain.link.entity.Link;
import com.project.bearlink.domain.link.entity.PreviewStatus;
import com.project.bearlink.domain.link.repository.LinkRepository;
import com.project.bearlink.domain.link.service.LinkPreviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class LinkPreviewWorker {
    private final LinkPreviewService previewService;
    private final LinkRepository linkRepository;

    @Scheduled(fixedDelay = 1000)
    public void consumeQueue() {
        Optional<Link> pending = linkRepository.findFirstByPreviewStatus(PreviewStatus.PENDING);

        pending.ifPresent(link -> {
            try {
                LinkPreviewDto dto = previewService.extract(link.getUrl());

                if (dto != null) {
                    // 제목이 비어있을 때만 자동 추출된 제목으로 설정
                    if ((link.getTitle() == null || link.getTitle().isBlank()) && dto.getTitle() != null) {
                        link.setTitle(dto.getTitle());
                    }

                    link.setThumbnailImageUrl(dto.getThumbnailImageUrl());
                    link.setPrice(dto.getPrice());
                    link.setPreviewStatus(PreviewStatus.COMPLETE);
                    linkRepository.save(link);
                } else {
                    link.setPreviewStatus(PreviewStatus.FAILED);
                }
            } catch (Exception e) {
                link.setPreviewStatus(PreviewStatus.FAILED);
                log.error("❌ 링크 미리보기 추출 실패: {}", link.getUrl(), e);
            }
        });
    }
}