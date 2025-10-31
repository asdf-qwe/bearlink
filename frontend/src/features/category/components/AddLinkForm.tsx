import { Plus, Loader2 } from "lucide-react";
import { NewLinkData } from "@/features/category/types/categoryPageTypes";
import { ErrorMessage } from "./ErrorMessage";

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
  showButton?: boolean;
}

// 새 링크 추가 버튼 컴포넌트 추가
export const AddLinkButton = ({ onShowForm }: { onShowForm: () => void }) => (
  <button
    onClick={onShowForm}
    className="flex items-center space-x-2 px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-base font-medium"
  >
    <Plus size={20} />
    <span>새 링크 추가</span>
  </button>
);

export const AddLinkForm = ({
  newLinkData,
  showAddLinkForm,
  addingLink,
  error,
  onUrlChange,
  onTitleChange,
  onSubmit,
  onCancel,
  onShowForm,
  onKeyPress,
}: AddLinkFormProps) => {
  if (!showAddLinkForm) {
    return null;
  }

  return (
    <div className="absolute top-full right-0 mt-2 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-80">
      <h3 className="text-base font-semibold text-amber-900 mb-3">
        새 링크 추가
      </h3>

      {error && <ErrorMessage message={error} className="mb-3" />}

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-amber-700 mb-1">
            URL
          </label>
          <input
            type="url"
            value={newLinkData.url}
            onChange={(e) => onUrlChange(e.target.value)}
            onKeyDown={onKeyPress}
            placeholder="https://example.com"
            className="w-full p-2 text-sm border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
            disabled={addingLink}
            autoFocus
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-amber-700 mb-1">
            제목
          </label>
          <input
            type="text"
            value={newLinkData.title}
            onChange={(e) => onTitleChange(e.target.value)}
            onKeyDown={onKeyPress}
            placeholder="제목 (유튜브는 자동 생성)"
            className="w-full p-2 text-sm border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
            disabled={addingLink}
          />
        </div>

        <div className="flex space-x-2">
          <button
            onClick={onSubmit}
            disabled={!newLinkData.url.trim() || addingLink}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-amber-600 text-white rounded hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {addingLink && <Loader2 className="h-3 w-3 animate-spin" />}
            <span>{addingLink ? "추가 중..." : "추가"}</span>
          </button>
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
            disabled={addingLink}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};
