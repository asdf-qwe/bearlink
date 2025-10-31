import React from "react";
import { Edit, Trash2, Loader2, ExternalLink } from "lucide-react";
import { RoomLinkListDto } from "../type/room";
import { Favicon } from "@/components/Favicon";

interface RoomLinkListItemProps {
  link: RoomLinkListDto;
  editing: boolean;
  editingTitle: string;
  submitting: boolean;
  onEdit: (link: RoomLinkListDto) => void;
  onDelete: (id: number) => void;
  onTitleChange: (title: string) => void;
  onSaveTitle: (id: number, title: string) => void;
  onCancelEdit: () => void;
  onKeyPress: (e: React.KeyboardEvent, id: number) => void;
}

export const RoomLinkListItem: React.FC<RoomLinkListItemProps> = ({
  link,
  editing,
  editingTitle,
  submitting,
  onEdit,
  onDelete,
  onTitleChange,
  onSaveTitle,
  onCancelEdit,
  onKeyPress,
}) => {
  const handleLinkClick = () => {
    window.open(link.url, "_blank");
  };

  return (
    <div className="group flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all duration-200">
      {/* 파비콘 */}
      <div className="flex-shrink-0 mr-3">
        <Favicon
          url={link.url}
          fallbackIcon="/link-placeholder.png"
          size={24}
          className="rounded"
          alt={`${link.title} 사이트 아이콘`}
        />
      </div>

      {/* 제목과 URL */}
      <div className="flex-1 min-w-0">
        {editing ? (
          <div className="space-y-2">
            <input
              type="text"
              value={editingTitle || ""}
              onChange={(e) => onTitleChange(e.target.value)}
              onKeyDown={(e) => onKeyPress(e, link.id)}
              className="w-full px-2 py-1 text-sm font-medium text-gray-900 bg-amber-50 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
              autoFocus
              placeholder="링크 제목을 입력하세요"
            />
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSaveTitle(link.id, editingTitle);
                }}
                className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
              >
                저장
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCancelEdit();
                }}
                className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3 className="text-sm font-medium text-gray-900 truncate mb-1">
              {link.title}
            </h3>
            <p className="text-xs text-gray-500 truncate">{link.url}</p>
          </>
        )}
      </div>

      {/* 링크 ID (임시) */}
      <div className="flex-shrink-0 mr-3">
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
          #{link.id}
        </span>
      </div>

      {/* 액션 버튼들 */}
      {!editing && (
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {/* 외부 링크 버튼 */}
          <button
            onClick={handleLinkClick}
            className="p-2 text-gray-400 hover:text-amber-600 transition-colors"
            title="링크로 이동"
          >
            <ExternalLink size={16} />
          </button>

          {/* 편집 버튼 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(link);
            }}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
            title="제목 편집"
          >
            <Edit size={16} />
          </button>

          {/* 삭제 버튼 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(link.id);
            }}
            disabled={submitting}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
            title="링크 삭제"
          >
            {submitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}
          </button>
        </div>
      )}
    </div>
  );
};
