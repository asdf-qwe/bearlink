package com.project.bearlink.domain.myPage.controller;

import com.project.bearlink.domain.myPage.dto.UpdateProfileDto;
import com.project.bearlink.domain.myPage.service.MyPageService;
import com.project.bearlink.global.response.ApiResponse;
import com.project.bearlink.global.security.auth.SecurityUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/v1/myPage")
@RequiredArgsConstructor
public class Ap1V1MyPageController {
    private final MyPageService myPageService;


    @PutMapping
    public ResponseEntity<ApiResponse<String>> updateProfile(@AuthenticationPrincipal SecurityUser user, @RequestBody UpdateProfileDto dto){
            myPageService.updateProfile(user.getId(), dto);
        return ResponseEntity.ok(ApiResponse.ok("변경이 완료 되었습니다."));
    }
}
