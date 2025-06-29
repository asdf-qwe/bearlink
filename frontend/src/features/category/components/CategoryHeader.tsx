import { Edit } from "lucide-react";
import { ErrorMessage } from "./ErrorMessage";

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

export const CategoryHeader = ({
  categoryName,
  editingCategory,
  error,
  onEditStart,
  onCategoryNameChange,
  onSave,
  onCancel,
  onKeyPress,
}: CategoryHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center space-x-3 mb-2">
        {editingCategory ? (
          <>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => onCategoryNameChange(e.target.value)}
              onKeyDown={onKeyPress}
              className="text-3xl font-bold text-amber-900 bg-amber-50 border border-amber-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              autoFocus
            />
            <div className="flex space-x-2">
              <button
                onClick={onSave}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                저장
              </button>
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                취소
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-amber-900">
              {categoryName}
            </h1>
            <button
              onClick={onEditStart}
              className="p-2 text-amber-600 hover:text-amber-800 hover:bg-amber-100 rounded"
              aria-label="카테고리 이름 편집"
            >
              <Edit size={20} />
            </button>
          </>
        )}
      </div>

      {error && editingCategory && <ErrorMessage message={error} />}
    </div>
  );
};
