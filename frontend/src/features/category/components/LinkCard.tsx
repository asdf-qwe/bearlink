import { Edit, Trash2, Loader2 } from "lucide-react";
import { LinkItem } from "@/features/category/types/categoryPageTypes";
import { getCategoryIcon } from "@/features/category/utils/categoryIcons";

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

export const LinkCard = ({
  link,
  categoryIndex,
  editingLinkId,
  editingLinkTitle,
  deletingLinkId,
  onEdit,
  onDelete,
  onTitleChange,
  onSaveTitle,
  onCancelEdit,
  onKeyPress,
}: LinkCardProps) => {
  const handleLinkClick = () => {
    if (window.electronAPI?.openExternal) {
      window.electronAPI.openExternal(link.url);
    } else {
      window.open(link.url, "_blank");
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const parent = e.currentTarget.parentElement;
    if (parent) {
      e.currentTarget.style.display = "none";
      parent.innerHTML = `
        <div class="flex items-center justify-center w-full h-full">
          <img src="${getCategoryIcon(
            categoryIndex
          )}" alt="카테고리 아이콘" class="w-24 h-24 object-contain" />
        </div>
      `;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition-shadow relative">
      {/* 삭제 버튼 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(link.id);
        }}
        disabled={deletingLinkId === link.id}
        className="absolute top-2 right-2 z-10 p-2 bg-white bg-opacity-80 rounded-full text-red-500 hover:text-red-700 hover:bg-opacity-100 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
        aria-label={`${link.title} 링크 삭제`}
      >
        {deletingLinkId === link.id ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Trash2 size={16} />
        )}
      </button>

      {/* 편집 버튼 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit(link.id, link.title);
        }}
        className="absolute top-2 right-12 z-10 p-2 bg-white bg-opacity-80 rounded-full text-amber-500 hover:text-amber-700 hover:bg-opacity-100 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label={`${link.title} 링크 제목 편집`}
      >
        <Edit size={16} />
      </button>

      {/* 썸네일 */}
      <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
        {link.thumbnailImageUrl ? (
          <img
            src={link.thumbnailImageUrl}
            alt={`${link.title} 썸네일`}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <img
            src={getCategoryIcon(categoryIndex)}
            alt="카테고리 아이콘"
            className="w-24 h-24 object-contain"
          />
        )}
      </div>

      {/* 카드 내용 */}
      <div className="p-4">
        {/* 제목 */}
        {editingLinkId === link.id ? (
          <div className="mb-2">
            <input
              type="text"
              value={editingLinkTitle || ""}
              onChange={(e) => onTitleChange(e.target.value)}
              onKeyDown={(e) => onKeyPress(e, link.id)}
              className="w-full text-lg font-semibold text-amber-900 bg-amber-50 border border-amber-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
              autoFocus
            />
            <div className="flex space-x-2 mt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSaveTitle(link.id, editingLinkTitle);
                }}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                저장
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCancelEdit();
                }}
                className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <h3 className="font-semibold text-amber-900 text-lg mb-2 line-clamp-2">
            {link.title}
          </h3>
        )}

        {/* 가격 정보 */}
        {link.price && (
          <div className="text-lg font-bold text-green-600 mb-2">
            {link.price}
          </div>
        )}

        {/* URL */}
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-amber-600 hover:text-amber-800 hover:underline block truncate"
          title={link.url}
        >
          {link.url}
        </a>
      </div>

      {/* 클릭 영역 (전체 카드) - 편집 모드가 아닐 때만 활성화 */}
      {editingLinkId !== link.id && (
        <div
          onClick={handleLinkClick}
          className="absolute inset-0 z-0 cursor-pointer"
          aria-label={`${link.title} 링크로 이동`}
        />
      )}
    </div>
  );
};
