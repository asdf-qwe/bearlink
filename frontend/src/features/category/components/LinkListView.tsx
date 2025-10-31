import React, { useState } from "react";
import { LinkIcon, Plus, Minus } from "lucide-react";
import { LinkItem } from "@/features/category/types/categoryPageTypes";
import { LinkListItem } from "./LinkListItem";

interface LinkListViewProps {
  links: LinkItem[];
  categoryIndex: number;
  editingLinkId: number | null;
  editingLinkTitle: string;
  deletingLinkId: number | null;
  onEditLink: (linkId: number, title: string) => void;
  onDeleteLink: (linkId: number) => void;
  onTitleChange: (title: string) => void;
  onSaveTitle: (linkId: number, title: string) => void;
  onCancelEdit: () => void;
  onKeyPress: (e: React.KeyboardEvent, linkId: number) => void;
}

export const LinkListView: React.FC<LinkListViewProps> = ({
  links,
  categoryIndex,
  editingLinkId,
  editingLinkTitle,
  deletingLinkId,
  onEditLink,
  onDeleteLink,
  onTitleChange,
  onSaveTitle,
  onCancelEdit,
  onKeyPress,
}) => {
  const [isSection1Collapsed, setIsSection1Collapsed] = useState(false);
  const [isSection2Collapsed, setIsSection2Collapsed] = useState(false);

  // 링크를 두 그룹으로 나누기 (절반씩)
  const midIndex = Math.ceil(links.length / 2);
  const section1Links = links.slice(0, midIndex);
  const section2Links = links.slice(midIndex);

  const renderSection = (
    title: string,
    sectionLinks: LinkItem[],
    isCollapsed: boolean,
    onToggle: () => void
  ) => (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      {/* 섹션 헤더 */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-amber-900 flex items-center">
            <LinkIcon size={20} className="mr-2" />
            {title}
            <span className="ml-2 text-sm text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
              {sectionLinks.length}
            </span>
          </h3>
          <button
            onClick={onToggle}
            className="p-1 text-amber-600 hover:text-amber-800 transition-colors"
            title={isCollapsed ? "펼치기" : "접기"}
          >
            {isCollapsed ? <Plus size={20} /> : <Minus size={20} />}
          </button>
        </div>
      </div>

      {/* 섹션 내용 */}
      {!isCollapsed && (
        <div className="p-4">
          {sectionLinks.length === 0 ? (
            <div className="text-center py-8">
              <LinkIcon size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">이 섹션에 링크가 없습니다</p>
            </div>
          ) : (
            <div className="relative">
              <div
                className={`space-y-2 ${
                  sectionLinks.length > 6
                    ? "max-h-[400px] overflow-y-auto pr-2 custom-scrollbar"
                    : ""
                }`}
              >
                {sectionLinks.map((link) => (
                  <LinkListItem
                    key={link.id}
                    link={link}
                    categoryIndex={categoryIndex}
                    editingLinkId={editingLinkId}
                    editingLinkTitle={editingLinkTitle}
                    deletingLinkId={deletingLinkId}
                    onEdit={onEditLink}
                    onDelete={onDeleteLink}
                    onTitleChange={onTitleChange}
                    onSaveTitle={onSaveTitle}
                    onCancelEdit={onCancelEdit}
                    onKeyPress={onKeyPress}
                  />
                ))}
              </div>
              {/* 스크롤 힌트 */}
              {sectionLinks.length > 6 && (
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent pointer-events-none" />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 섹션 1 */}
      {renderSection("링크 그룹 1", section1Links, isSection1Collapsed, () =>
        setIsSection1Collapsed(!isSection1Collapsed)
      )}

      {/* 섹션 2 */}
      {renderSection("링크 그룹 2", section2Links, isSection2Collapsed, () =>
        setIsSection2Collapsed(!isSection2Collapsed)
      )}
    </div>
  );
};
