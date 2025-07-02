import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export const ErrorMessage = ({
  message,
  className = "",
}: ErrorMessageProps) => {
  return (
    <div
      className={`bg-red-100 border border-red-400 rounded p-3 flex items-center ${className}`}
    >
      <AlertCircle size={16} className="text-red-600 mr-2" />
      <span className="text-red-700 text-sm">{message}</span>
    </div>
  );
};
