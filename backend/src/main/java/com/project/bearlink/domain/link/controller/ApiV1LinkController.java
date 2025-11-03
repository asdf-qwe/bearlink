package com.project.bearlink.domain.link.controller;

import com.project.bearlink.domain.link.dto.LinkRequestDto;
import com.project.bearlink.domain.link.dto.LinkResponseDto;
import com.project.bearlink.domain.link.dto.LinkUpdateDto;
import com.project.bearlink.domain.link.entity.Link;

import com.project.bearlink.domain.link.service.LinkService;
import com.project.bearlink.global.response.ApiResponse;
import com.project.bearlink.global.security.auth.SecurityUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/link")
@RequiredArgsConstructor
public class ApiV1LinkController {
    private final LinkService linkService;

    @PostMapping
    public ResponseEntity<ApiResponse<String>> createLink (@RequestParam Long userId, @RequestBody LinkRequestDto req, @RequestParam Long categoryId) {
           linkService.createLink(req, userId, categoryId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("링크 생성 성공"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LinkResponseDto>>> getLinks (@RequestParam Long userId, @RequestParam Long categoryId){
        List<LinkResponseDto> links = linkService.getLinks(userId, categoryId);
        return ResponseEntity.ok(ApiResponse.ok(links));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<String>> updateTitle (@RequestBody LinkUpdateDto dto, @RequestParam Long linkId) {
        Link link = linkService.updateTitle(linkId, dto);
        return ResponseEntity.ok().body(ApiResponse.ok("링크 제목 수정 완료"));
    }

    @DeleteMapping
    public void deleteLink(@RequestParam Long linkId) {

        linkService.deleteLink(linkId);
    }

    @GetMapping("/youtube-ids/{categoryId}")
    public List<String> getYoutubeVideoIds(@PathVariable Long categoryId,
                                           @AuthenticationPrincipal SecurityUser user) {
        return linkService.getYoutubeVideoIds(user.getId(), categoryId);
    }
}
