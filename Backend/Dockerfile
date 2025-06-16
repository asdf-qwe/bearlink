# 첫 번째 스테이지: 빌드
FROM gradle:jdk21-graal-jammy AS builder

WORKDIR /app

# Gradle 래퍼 및 설정 파일 복사
COPY gradlew ./
COPY gradle ./gradle
COPY build.gradle.kts ./
COPY settings.gradle.kts ./

RUN chmod +x ./gradlew

# 종속성 설치 (캐시 최적화)
RUN ./gradlew dependencies --no-daemon

# 소스 복사
COPY src ./src

# 빌드
RUN ./gradlew build --no-daemon

# 두 번째 스테이지: 실행
FROM ghcr.io/graalvm/jdk-community:21

WORKDIR /app

# 빌드된 JAR 복사
COPY --from=builder /app/build/libs/bearlink-0.0.1-SNAPSHOT.jar app.jar

# 실행
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=prod", "app.jar"]