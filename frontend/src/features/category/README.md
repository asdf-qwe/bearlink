# Category Page 리팩토링

이 문서는 Category 페이지의 리팩토링된 구조에 대해 설명합니다.

## 📁 새로운 파일 구조

```
src/features/category/
├── components/           # UI 컴포넌트들
│   ├── AddLinkForm.tsx  # 링크 추가 폼 컴포넌트
│   ├── CategoryHeader.tsx # 카테고리 헤더 컴포넌트
│   ├── ErrorMessage.tsx # 에러 메시지 컴포넌트
│   ├── LinkCard.tsx     # 개별 링크 카드 컴포넌트
│   ├── LinkGrid.tsx     # 링크 그리드 컴포넌트
│   └── PageStates.tsx   # 로딩/에러/미발견 상태 컴포넌트
├── hooks/               # 커스텀 훅들
│   ├── useCategoryPage.ts # 카테고리 페이지 비즈니스 로직
│   └── useLocalStorage.ts # 로컬 스토리지 관리
├── types/               # 타입 정의
│   └── categoryPageTypes.ts # 카테고리 페이지 타입들
└── utils/               # 유틸리티 함수들
    └── categoryIcons.ts # 카테고리 아이콘 관련 유틸
```

## 🔄 주요 개선사항

### 1. 컴포넌트 분리

- **기존**: 하나의 거대한 컴포넌트 (750+ 줄)
- **개선**: 재사용 가능한 작은 컴포넌트들로 분리
  - `CategoryHeader`: 카테고리 제목 편집
  - `AddLinkForm`: 링크 추가 폼
  - `LinkGrid`: 링크 목록 표시
  - `LinkCard`: 개별 링크 카드
  - `ErrorMessage`: 에러 메시지 표시
  - `PageStates`: 로딩/에러/미발견 상태

### 2. 커스텀 훅 도입

- **`useCategoryPage`**: 모든 비즈니스 로직을 관리
  - 상태 관리
  - API 호출
  - 이벤트 처리
- **`useLocalStorage`**: 로컬 스토리지 관리 로직 분리

### 3. 타입 안전성 향상

- 모든 인터페이스를 별도 파일로 분리
- 타입 정의 개선 및 일관성 확보

### 4. 유틸리티 함수 분리

- 카테고리 아이콘 관련 로직을 별도 유틸로 분리
- 재사용성 향상

## 🎯 사용법

### 메인 페이지

```tsx
// src/app/main/category/[id]/page.tsx
export default function CategoryPage() {
  const { userInfo } = useAuth();
  const categoryId = Number(params.id as string);

  const {
    category,
    loading,
    error,
    // ... 기타 상태 및 액션들
  } = useCategoryPage({ categoryId, userId: userInfo?.id });

  // 간단한 조건부 렌더링과 이벤트 핸들러만 포함
}
```

### 커스텀 훅 사용

```tsx
// 비즈니스 로직은 모두 훅에서 처리
const {
  // 상태
  category,
  loading,
  error,

  // 액션
  addLink,
  removeLink,
  updateLinkTitle,
  saveCategoryName,
} = useCategoryPage({ categoryId, userId });
```

## 🔧 컴포넌트 API

### CategoryHeader

```tsx
interface CategoryHeaderProps {
  categoryName: string;
  editingCategory: boolean;
  error: string | null;
  onEditStart: () => void;
  onCategoryNameChange: (name: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}
```

### AddLinkForm

```tsx
interface AddLinkFormProps {
  newLinkData: NewLinkData;
  showAddLinkForm: boolean;
  addingLink: boolean;
  error: string | null;
  onUrlChange: (url: string) => void;
  onTitleChange: (title: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  onShowForm: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}
```

### LinkCard

```tsx
interface LinkCardProps {
  link: LinkItem;
  categoryIndex: number;
  editingLinkId: number | null;
  editingLinkTitle: string;
  deletingLinkId: number | null;
  onEdit: (linkId: number, title: string) => void;
  onDelete: (linkId: number) => void;
  onTitleChange: (title: string) => void;
  onSaveTitle: (linkId: number, title: string) => void;
  onCancelEdit: () => void;
  onKeyPress: (e: React.KeyboardEvent, linkId: number) => void;
}
```

## 📊 장점

1. **유지보수성**: 작은 컴포넌트들로 분리되어 수정이 용이
2. **재사용성**: 컴포넌트들을 다른 페이지에서도 재사용 가능
3. **테스트 용이성**: 각 컴포넌트와 훅을 독립적으로 테스트 가능
4. **가독성**: 각 파일의 책임이 명확하여 코드 이해가 쉬움
5. **타입 안전성**: TypeScript를 활용한 강력한 타입 체크
6. **성능**: 불필요한 리렌더링 방지 및 최적화 가능

## 🚀 추후 개선 가능한 부분

1. **React.memo()** 적용으로 성능 최적화
2. **React Query** 도입으로 서버 상태 관리 개선
3. **Storybook** 추가로 컴포넌트 문서화
4. **단위 테스트** 추가
5. **에러 바운더리** 도입으로 에러 처리 개선
