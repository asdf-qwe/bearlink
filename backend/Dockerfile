# 첫 번째 스테이지: 빌드 스테이지
FROM gradle:jdk-21-and-23-graal-jammy AS builder

WORKDIR /app

# 빌드 파일 복사
COPY build.gradle.kts .
COPY settings.gradle.kts .

# 종속성 캐시
RUN gradle dependencies --no-daemon

# 전체 소스 코드 복사 (리소스 포함)
COPY src src

# 빌드 실행
RUN gradle build --no-daemon -x test

# 두 번째 스테이지: 실행 스테이지
FROM container-registry.oracle.com/graalvm/jdk:23

WORKDIR /app

# 빌드 결과물 복사
COPY --from=builder /app/build/libs/*.jar app.jar

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=prod", "app.jar"]