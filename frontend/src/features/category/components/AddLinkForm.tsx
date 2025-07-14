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
}

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
    return (
      <button
        onClick={onShowForm}
        className="flex items-center space-x-2 mb-6 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
      >
        <Plus size={20} />
        <span>새 링크 추가</span>
      </button>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-amber-900 mb-4">
        새 링크 추가
      </h3>

      {error && <ErrorMessage message={error} className="mb-4" />}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-amber-700 mb-1">
            URL
          </label>
          <input
            type="url"
            value={newLinkData.url}
            onChange={(e) => onUrlChange(e.target.value)}
            onKeyDown={onKeyPress}
            placeholder="https://example.com"
            className="w-full p-2 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
            disabled={addingLink}
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-amber-700 mb-1">
            제목
          </label>
          <input
            type="text"
            value={newLinkData.title}
            onChange={(e) => onTitleChange(e.target.value)}
            onKeyDown={onKeyPress}
            placeholder="제목을 입력해주세요 (유튜브는 제목 입력을 안해도 자동생성 됩니다.)"
            className="w-full p-2 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
            disabled={addingLink}
          />
        </div>

        <div className="flex space-x-2">
          <button
            onClick={onSubmit}
            disabled={!newLinkData.url.trim() || addingLink}
            className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {addingLink && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>{addingLink ? "추가 중..." : "추가"}</span>
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            disabled={addingLink}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};
