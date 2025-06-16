# -------------------------------
# 1단계: 빌드 스테이지
# -------------------------------
    FROM gradle:jdk21-graal-jammy AS builder

    WORKDIR /app
    
    COPY gradlew ./
    COPY gradle ./gradle
    COPY build.gradle.kts ./
    COPY settings.gradle.kts ./
    
    RUN chmod +x ./gradlew
    
    COPY src ./src
    
    # 전체 빌드 (테스트 생략)
    RUN ./gradlew clean build -x test --no-daemon
    
    # -------------------------------
    # 2단계: 실행 스테이지
    # -------------------------------
    FROM ghcr.io/graalvm/jdk-community:21
    
    WORKDIR /app
    
    COPY --from=builder /app/build/libs/bearlink-0.0.1-SNAPSHOT.jar app.jar
    
    ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=prod", "app.jar"]
    