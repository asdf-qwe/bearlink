package com.project.bearlink.domain.link.controller;

import com.project.bearlink.domain.link.dto.LinkPreviewDto;
import com.project.bearlink.domain.link.dto.LinkRequestDto;
import com.project.bearlink.domain.link.dto.LinkResponseDto;
import com.project.bearlink.domain.link.dto.LinkUpdateDto;
import com.project.bearlink.domain.link.entity.Link;
import com.project.bearlink.domain.link.service.LinkService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/link")
@RequiredArgsConstructor
public class ApiV1LinkController {
    private final LinkService linkService;


    @PostMapping
    public ResponseEntity<String> createLink (@RequestParam Long userId, @RequestBody LinkRequestDto req, @RequestParam Long categoryId) {
           Link link = linkService.createLink(req, userId, categoryId);
        return ResponseEntity.ok().body("링크 생성 성공");
    }

    @GetMapping
    public ResponseEntity<List<LinkResponseDto>> getLinks (@RequestParam Long userId, @RequestParam Long categoryId){
        List<LinkResponseDto> links = linkService.getLinks(userId, categoryId);
        return ResponseEntity.ok(links);
    }

    @PutMapping
    public ResponseEntity<String> updateTitle (@RequestBody LinkUpdateDto dto, @RequestParam Long linkId) {
        Link link = linkService.updateTitle(linkId, dto);
        return ResponseEntity.ok().body("링크 제목 수정 완료");
    }

//    @GetMapping("/preview")
//    public ResponseEntity<LinkPreviewDto> getLinkPreview(@RequestParam String url) {
//        LinkPreviewDto dto = linkService.extractLinkPreview(url);
//
//        if (dto != null) {
//            return ResponseEntity.ok(dto);
//        } else {
//            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
//        }
//    }

    @DeleteMapping
    public void deleteLink(@RequestParam Long linkId) {
        linkService.deleteLink(linkId);
    }
}
