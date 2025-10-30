package com.project.bearlink.global.security.filter;

import com.project.bearlink.domain.user.user.entity.User;
import com.project.bearlink.global.rq.Rq;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class CustomAuthenticationFilter extends OncePerRequestFilter {

    private final Rq rq;

    private record AuthTokens(String refreshToken, String accessToken) {}

    // 요청에서 토큰 꺼내기 (헤더 또는 쿠키)
    private AuthTokens getAuthTokensFromRequest() {
        String authorization = rq.getHeader("Authorization");

        if (authorization != null && authorization.startsWith("Bearer ")) {
            String accessToken = authorization.substring("Bearer ".length());
            return new AuthTokens(null, accessToken);
        }

        String refreshToken = rq.getCookieValue("refreshToken");
        String accessToken = rq.getCookieValue("accessToken");

        log.info(" accessToken from cookie: {}", accessToken);

        if (accessToken != null) {
            return new AuthTokens(refreshToken, accessToken);
        }

        return null;
    }

    // accessToken → 유저 객체
    private User getUserFromAccessToken(String accessToken) {
        return rq.getUserFromAccessToken(accessToken);
    }

    // refreshToken → 유저 & accessToken 재발급
    private User refreshAccessTokenByRefreshToken(String refreshToken) {
        return rq.refreshAccessTokenByRefreshToken(refreshToken);
    }

    // 토큰이 있는지 먼저 검증
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        log.info("요청 URI: {}", request.getRequestURI());

        // API 요청이 아니면 통과
        if (!request.getRequestURI().startsWith("/api/")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 인증 필요 없는 엔드포인트는 통과
        if (List.of(
                "/api/v1/users/signup",
                "/api/v1/users/login",
                "/api/v1/users/refresh"
        ).contains(request.getRequestURI())) {
            filterChain.doFilter(request, response);
            return;
        }


        try {
            AuthTokens authTokens = getAuthTokensFromRequest();
            if (authTokens == null) {
                filterChain.doFilter(request, response);
                return;
            }

            String refreshToken = authTokens.refreshToken();
            String accessToken = authTokens.accessToken();

            User user = getUserFromAccessToken(accessToken);
            log.info("토큰 기반 사용자 확인 결과: {}", user != null ? user.getEmail() : "유저 없음");


            if (user == null && refreshToken != null) {
                user = refreshAccessTokenByRefreshToken(refreshToken);
            }


            if (user != null) {
                log.info("로그인 인증 완료: {}", user.getEmail());
                rq.setLogin(user);
                log.info("SecurityContext에 로그인 설정 완료");
            } else {


                log.warn("로그인 인증 실패: 유효한 토큰이 아님");


                rq.deleteCookie("accessToken");
                rq.deleteCookie("refreshToken");
            }
        } catch (Exception e) {
            log.error("CustomAuthenticationFilter 예외 발생", e);
        }

        // 다음 필터로 넘김
        filterChain.doFilter(request, response);
    }
}
