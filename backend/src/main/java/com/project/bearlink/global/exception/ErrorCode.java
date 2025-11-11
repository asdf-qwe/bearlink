package com.project.bearlink.global.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    // 400 BAD_REQUEST
    BAD_REQUEST(HttpStatus.BAD_REQUEST, "잘못된 요청입니다."),
    ALREADY_PROCESSED_REQUEST(HttpStatus.BAD_REQUEST, "이미 처리된 요청입니다."),

    SELF_REQUEST_NOT_ALLOWED(HttpStatus.BAD_REQUEST, "본인에게 친구 요청을 보낼 수 없습니다."),
    DUPLICATE_REQUEST_PENDING(HttpStatus.BAD_REQUEST, "이미 친구 요청을 보냈습니다."),
    REQUESTER_NOT_FOUND(HttpStatus.BAD_REQUEST, "요청자 정보를 찾을 수 없습니다."),
    RECEIVER_NOT_FOUND(HttpStatus.BAD_REQUEST, "수신자 정보를 찾을 수 없습니다."),
    FRIEND_REQUEST_NOT_FOUND(HttpStatus.BAD_REQUEST, "해당 친구 요청이 존재하지 않습니다."),
    ALREADY_INVITED_MEMBER(HttpStatus.BAD_REQUEST, "이미 초대된 멤버입니다."),
    INVITATION_ALREADY_ACCEPTED(HttpStatus.BAD_REQUEST, "이미 초대가 수락되었습니다."),

    // 401 UNAUTHORIZED
    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "아이디 또는 비밀번호가 올바르지 않습니다."),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "유효하지 않은 토큰입니다."),
    EXPIRED_TOKEN(HttpStatus.UNAUTHORIZED, "만료된 토큰입니다."),
    INVALID_REFRESH_TOKEN(HttpStatus.UNAUTHORIZED, "유효하지 않은 리프레시 토큰입니다."),
    INVALID_PASSWORD(HttpStatus.UNAUTHORIZED, "비밀번호가 일치하지 않습니다."),

    // 403 FORBIDDEN
    INVITATION_ACCESS_DENIED(HttpStatus.FORBIDDEN, "초대받지 않은 사용자입니다."),
    ROOM_INVITE_FORBIDDEN(HttpStatus.FORBIDDEN, "방장만 초대할 수 있습니다."),
    ACCESS_DENIED(HttpStatus.FORBIDDEN, "접근 권한이 없습니다."),
    FORBIDDEN(HttpStatus.FORBIDDEN, "권한이 없습니다."),
    ACCOUNT_SUSPENDED(HttpStatus.FORBIDDEN, "정지된 계정입니다. 관리자에게 문의하세요."),
    FORBIDDEN_REQUEST_ACTION(HttpStatus.FORBIDDEN, "이 요청을 거절할 수 있는 권한이 없습니다."),

    // 404 NOT_FOUND
    ROOM_MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, "초대된 멤버를 찾을 수 없습니다."),
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 사용자입니다."),
    CATEGORY_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 카테고리입니다."),
    LINK_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 링크입니다."),
    ROOM_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 방입니다."),
    NOT_FOUND_ARCHIVE(HttpStatus.NOT_FOUND, "해당 자료를 찾을 수 없습니다."),
    NOT_FOUND_CHATROOM(HttpStatus.NOT_FOUND, "해당 채팅방을 찾을 수 없습니다."),

    // 409 CONFLICT
    EMAIL_ALREADY_EXISTS(HttpStatus.CONFLICT, "이미 등록된 이메일입니다."),
    NICKNAME_ALREADY_EXISTS(HttpStatus.CONFLICT, "이미 사용 중인 닉네임입니다."),

    // 500 INTERNAL_SERVER_ERROR
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "서버 오류가 발생했습니다."),
    INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "파일 형식이 올바르지 않습니다.");

    private final HttpStatus httpStatus;
    private final String message;
}