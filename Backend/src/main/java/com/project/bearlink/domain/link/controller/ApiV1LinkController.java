package com.project.bearlink.domain.link.controller;

import com.project.bearlink.domain.link.dto.LinkRequestDto;
import com.project.bearlink.domain.link.dto.LinkResponseDto;
import com.project.bearlink.domain.link.entity.Link;
import com.project.bearlink.domain.link.service.LinkService;
import lombok.RequiredArgsConstructor;
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

}
