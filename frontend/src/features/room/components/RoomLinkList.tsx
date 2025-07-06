import React from "react";
import { RoomChatDummy } from "./RoomChatDummy";
import { RoomLinkListDto } from "../type/room";

interface RoomLinkListProps {
  links: RoomLinkListDto[];
  loading: boolean;
}

export const RoomLinkList: React.FC<RoomLinkListProps> = ({
  links,
  loading,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">공유된 링크</h2>
        <div className="flex justify-center items-center py-10">
          <div className="text-amber-600">
            <svg
              className="animate-spin h-8 w-8 mr-3 inline-block"
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
            <span>링크 목록을 불러오는 중...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-0 mb-0">
      <h2 className="text-xl font-semibold mb-4">공유된 링크</h2>

      {links.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-transform hover:-translate-y-1"
              >
                <div className="border overflow-hidden hover:shadow-md">
                  {link.thumbnailImageUrl && (
                    <div className="aspect-video w-full overflow-hidden bg-gray-100">
                      <img
                        src={link.thumbnailImageUrl}
                        alt={link.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // 이미지 로드 실패 시 기본 이미지 표시
                          (e.target as HTMLImageElement).src =
                            "/link-placeholder.png";
                        }}
                      />
                    </div>
                  )}
                  <div className="p-3">
                    <h3 className="font-medium line-clamp-2" title={link.title}>
                      {link.title}
                    </h3>
                    <p
                      className="text-xs text-gray-500 mt-1 truncate"
                      title={link.url}
                    >
                      {link.url}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
          {/* 공유된 링크 카드 아래에 채팅 카드 삽입 */}
          <RoomChatDummy />
        </>
      ) : (
        <>
          <p className="text-gray-500 text-center py-8">
            이 링크룸에는 아직 공유된 링크가 없습니다.
          </p>
          {/* 링크가 없을 때도 채팅 카드 표시 */}
          <RoomChatDummy />
        </>
      )}
    </div>
  );
};
