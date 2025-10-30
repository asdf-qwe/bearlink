package com.project.bearlink.global.security.config;

import com.project.bearlink.global.rq.Rq;
import com.project.bearlink.global.security.filter.CustomAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity  // Spring Security 활성화
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final Rq rq;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean
    public CustomAuthenticationFilter customAuthenticationFilter() {
        return new CustomAuthenticationFilter(rq);
    }


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) // CSRF 비활성화 (세션사용 X : JWT 방식이므로 꺼도 됨)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(config -> config.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // 세션사용 X (JWT 기반 인증이므로)

                // 요청 경로별 권한 설정
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/v1/users/signup",
                                "/api/v1/users/login",
                                "/api/v1/users/refresh",
                                "/api/v1/link/**"
                        ).permitAll() // 회원가입, 로그인, 토큰 재발급 : 허용✔️
                        .requestMatchers("/actuator/health")
                        .permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/**").permitAll() // GET 요청 : 모두 허용✔️
                        .requestMatchers("/api/**").authenticated() // 그 외 /api/** 요청 : 인증 필요⚠️
                        .anyRequest().permitAll() // 나머지 요청 : 모두 허용✔️
                )

                // 커스텀 인증 필터를 UsernamePasswordAuthenticationFilter 앞에 넣음
                // → 요청마다 JWT 토큰 확인 → 인증되면 SecurityContext 로그인 상태 저장
                .addFilterBefore(customAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
                "http://localhost:3000",
                "https://www.bearlink.kr"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true); // 쿠키 등 인증 정보 포함 허용

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
