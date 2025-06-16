package com.project.bearlink.global.worker;

import com.project.bearlink.domain.link.dto.LinkPreviewDto;
import com.project.bearlink.domain.link.entity.Link;
import com.project.bearlink.domain.link.entity.PreviewStatus;
import com.project.bearlink.domain.link.repository.LinkRepository;
import com.project.bearlink.domain.link.service.LinkPreviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class LinkPreviewProcessor {

    private final LinkRepository linkRepository;
    private final LinkPreviewService previewService;

    @Async
    public void processLink(Long linkId) {
        try {
            Link link = linkRepository.findById(linkId).orElse(null);
            if (link == null) return;

            LinkPreviewDto dto = previewService.extract(link.getUrl());

            if (dto != null) {
                if ((link.getTitle() == null || link.getTitle().isBlank()) && dto.getTitle() != null) {
                    link.setTitle(dto.getTitle());
                }
                link.setThumbnailImageUrl(dto.getThumbnailImageUrl());
                link.setPrice(dto.getPrice());
                link.setPreviewStatus(PreviewStatus.COMPLETE);
            } else {
                link.setPreviewStatus(PreviewStatus.FAILED);
            }

            linkRepository.save(link);

        } catch (Exception e) {
            log.error("❌ 링크 미리보기 처리 중 예외 발생 (id: {}):", linkId, e);
        }
    }
}