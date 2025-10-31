import React from "react";
import { RoomLinkListDto } from "../type/room";
import { Favicon } from "@/components/Favicon";

interface RoomLinkCardProps {
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

export const RoomLinkCard: React.FC<RoomLinkCardProps> = ({
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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).src = "/link-placeholder.png";
  };

  return (
    <div
      className="bg-white rounded-md shadow group hover:shadow-lg transition-shadow relative cursor-pointer w-full max-w-[220px] mx-auto"
      style={{ minWidth: 0 }}
      onClick={editing ? undefined : handleLinkClick}
    >
      {/* 삭제 버튼 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(link.id);
        }}
        disabled={submitting}
        className="absolute top-2 right-2 z-10 p-2 bg-white bg-opacity-80 rounded-full text-red-500 hover:text-red-700 hover:bg-opacity-100 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
        aria-label={`${link.title} 링크 삭제`}
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 6h18M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z"
          />
        </svg>
      </button>
      {/* 편집 버튼 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit(link);
        }}
        className="absolute top-2 right-12 z-10 p-2 bg-white bg-opacity-80 rounded-full text-amber-500 hover:text-amber-700 hover:bg-opacity-100 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label={`${link.title} 링크 제목 편집`}
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15.232 5.232a2.828 2.828 0 1 1 4 4L7.5 21H3v-4.5l12.232-12.268z"
          />
        </svg>
      </button>
      {/* 썸네일 */}
      <div className="w-full h-32 bg-gray-100 flex items-center justify-center relative">
        {link.thumbnailImageUrl ? (
          <img
            src={link.thumbnailImageUrl}
            alt={`${link.title} 썸네일`}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <img
            src={"/link-placeholder.png"}
            alt="링크 썸네일 없음"
            className="w-24 h-24 object-contain"
          />
        )}

        {/* 파비콘 오버레이 */}
        <div className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-md">
          <Favicon
            url={link.url}
            fallbackIcon="/link-placeholder.png"
            size={20}
            className="rounded"
            alt={`${link.title} 사이트 아이콘`}
          />
        </div>
      </div>
      {/* 카드 내용 */}
      <div className="p-3">
        {/* 제목 */}
        {editing ? (
          <div className="mb-2">
            <input
              type="text"
              value={editingTitle || ""}
              onChange={(e) => onTitleChange(e.target.value)}
              onKeyDown={(e) => onKeyPress(e, link.id)}
              className="w-full text-lg font-semibold text-amber-900 bg-amber-50 border border-amber-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
              autoFocus
            />
            <div className="flex space-x-2 mt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSaveTitle(link.id, editingTitle);
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
        {/* URL */}
        <div className="flex items-center space-x-2">
          <Favicon
            url={link.url}
            fallbackIcon="/link-placeholder.png"
            size={14}
            className="rounded flex-shrink-0"
            alt={`${link.title} 사이트 아이콘`}
          />
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-amber-600 hover:text-amber-800 hover:underline truncate flex-1"
            title={link.url}
            onClick={(e) => e.stopPropagation()}
          >
            {link.url}
          </a>
        </div>
      </div>
    </div>
  );
};
