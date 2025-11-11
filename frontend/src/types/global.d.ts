export {};

declare global {
  interface Window {
    electronAPI?: {
      openExternal: (url: string) => void;
    };
  }

  // API 응답 타입 (백엔드 ApiResponse 클래스와 일치)
  interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
  }
}
