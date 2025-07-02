import React from "react";

interface LoadingStateProps {
  message: string;
}

export const LoadingState = ({ message }: LoadingStateProps) => (
  <div className="flex flex-col items-center justify-center h-screen bg-amber-50 -mt-16">
    <div className="text-amber-600 text-2xl mb-4">
      <svg
        className="animate-spin h-10 w-10 mr-3 inline-block"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <span>{message}</span>
    </div>
  </div>
);

interface ErrorStateProps {
  error: string;
  onBack: () => void;
}

export const ErrorState = ({ error, onBack }: ErrorStateProps) => (
  <div className="flex flex-col items-center justify-center h-screen bg-amber-50 -mt-16">
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md text-center">
      <div className="text-red-500 text-4xl mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-12 h-12 mx-auto"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold mb-2">오류가 발생했습니다</h2>
      <p className="text-gray-600 mb-4">{error}</p>
      <button
        onClick={onBack}
        className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md transition-colors"
      >
        돌아가기
      </button>
    </div>
  </div>
);

interface NotFoundStateProps {
  onBack: () => void;
}

export const NotFoundState = ({ onBack }: NotFoundStateProps) => (
  <div className="flex flex-col items-center justify-center h-screen bg-amber-50 -mt-16">
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md text-center">
      <div className="text-gray-400 text-4xl mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-12 h-12 mx-auto"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold mb-2">링크룸을 찾을 수 없습니다</h2>
      <p className="text-gray-600 mb-4">
        요청하신 링크룸이 존재하지 않거나 접근 권한이 없습니다.
      </p>
      <button
        onClick={onBack}
        className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md transition-colors"
      >
        돌아가기
      </button>
    </div>
  </div>
);
