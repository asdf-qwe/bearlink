package com.project.bearlink.global.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ApiResponse<T> {

    private final boolean success;
    private final String message;
    private final T data;

    // 성공 응답 (데이터 포함)
    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, "요청이 성공했습니다.", data);
    }

    // 성공 응답 (데이터 없음)
    public static <T> ApiResponse<T> ok() {
        return new ApiResponse<>(true, "요청이 성공했습니다.", null);
    }

    // 실패 응답
    public static <T> ApiResponse<T> fail(String message) {
        return new ApiResponse<>(false, message, null);
    }
}