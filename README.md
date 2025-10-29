# 🐻 BearLink  
> 링크를 저장하고, 공유하고, 함께 관리하는 **실시간 협업 북마크 플랫폼**

<br/>

## 📌 프로젝트 소개
BearLink는 흩어져 있는 링크들을 손쉽게 저장하고 분류할 수 있으며,  
친구와 함께 실시간으로 공유·협업할 수 있는 **생산성 북마크 서비스**입니다.

- 자료를 한 곳에 모아 관리하고 싶을 때
- 친구/동료와 링크를 함께 정리하고 싶을 때

이 문제들을 BearLink가 해결합니다 ✅

<br/>

## 🛠 Tech Stack

### Frontend
- **Next.js**, React, TypeScript, Tailwind CSS

### Backend
- **Spring Boot**, JPA, WebSocket

### Infra & Others
- AWS EC2, AWS S3
- MySQL
- YouTube Data API & Embed API

<br/>

## ✅ 주요 기능

### 🔐 인증 & 접근 제어
- 로그인 시 링크룸 및 마이페이지 활성화
- 접근 권한에 따라 개인/그룹 콘텐츠 구분

---

### 🔗 링크룸 (개인 + 그룹)

#### 📁 개인 링크룸
- 사이드바에서 **카테고리 생성 및 관리**
- 카테고리별 웹 링크 저장 및 분류
- **사이트 대표 이미지 자동 수집**
  - 불가능 시 → 서버 기본 이미지 제공
- ✅ **YouTube 링크 자동 처리**
  - 제목, 조회수 등 메타데이터 자동 반영
  - **Embedded Player**로 미리보기/재생 지원

#### 🧑‍🤝‍🧑 그룹 링크룸
- 친구 초대 기반 협업 공간 생성
- WebSocket 기반 **동시 편집 실시간 반영**
- **실시간 채팅 기능** 제공

---

### 👤 마이페이지
- 사용자 개인정보 관리
- 친구 목록 및 수락/삭제 기능

<br/>

### 🧩 System Architecture

BearLink는 아래 구조로 구성되어 있습니다.

- **Client**
  - Next.js 기반 SPA
  - REST API + WebSocket 혼합 통신

- **Backend**
  - Spring Boot 기반 API 서버
  - 링크 메타데이터 파싱 & 외부 API 연동
  - 그룹 실시간 협업(WebSocket) 처리

- **Database**
  - MySQL를 통해 사용자 정보 · 링크 데이터 저장

- **Object Storage**
  - AWS S3에 이미지/미디어 저장

- **External Services**
  - YouTube Data API · Embedded Player API 활용
<br/>

## 🚀 배포 및 데모  
- **라이브 데모 URL**: https://www.pofol.site/ 
- **접근 방법**: 데모 계정 또는 직접 회원가입 후 테스트 가능  

## 🧪 설치 및 실행 방법  
### 로컬 실행  
```bash
git clone https://github.com/asdf-qwe/bearlink.git  
cd bearlink  
# 백엔드 실행  
cd backend && ./mvnw spring-boot:run  
# 프론트엔드 실행  
cd ../frontend && npm install && npm run dev  

---

> **“링크를 연결하고, 사람을 이어주는 서비스”**  
BearLink는 계속 발전 중입니다 🐻✨
