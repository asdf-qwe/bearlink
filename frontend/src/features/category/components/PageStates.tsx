import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";

interface LoadingStateProps {
  message: string;
}

interface ErrorStateProps {
  error: string;
  onBack: () => void;
}

interface NotFoundStateProps {
  onBack: () => void;
}

export const LoadingState = ({ message }: LoadingStateProps) => (
  <div className="container mx-auto px-4 py-8 bg-amber-50 min-h-screen flex items-center justify-center">
    <div className="flex items-center space-x-2">
      <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      <span className="text-amber-700 text-lg">{message}</span>
    </div>
  </div>
);

export const ErrorState = ({ error, onBack }: ErrorStateProps) => (
  <div className="container mx-auto px-4 py-8 bg-amber-50 min-h-screen">
    <button
      onClick={onBack}
      className="flex items-center text-amber-700 hover:text-amber-900 mb-4"
    >
      <ArrowLeft size={20} className="mr-2" />
      뒤로 가기
    </button>
    <div className="bg-red-100 border border-red-400 rounded p-4 flex items-center">
      <AlertCircle size={20} className="text-red-600 mr-2" />
      <span className="text-red-700">{error}</span>
    </div>
  </div>
);

export const NotFoundState = ({ onBack }: NotFoundStateProps) => (
  <div className="container mx-auto px-4 py-8 bg-amber-50 min-h-screen">
    <button
      onClick={onBack}
      className="flex items-center text-amber-700 hover:text-amber-900 mb-4"
    >
      <ArrowLeft size={20} className="mr-2" />
      뒤로 가기
    </button>
    <div className="text-center text-amber-700">
      <p>카테고리를 찾을 수 없습니다.</p>
    </div>
  </div>
);
