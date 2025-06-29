import { LinkIcon } from "lucide-react";
import { LinkItem } from "@/features/category/types/categoryPageTypes";
import { LinkCard } from "./LinkCard";

interface LinkGridProps {
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

export const LinkGrid = ({
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
}: LinkGridProps) => {
  if (links.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-full text-center py-12">
          <LinkIcon size={48} className="text-amber-300 mx-auto mb-4" />
          <p className="text-amber-600">첫 번째 링크를 추가해보세요!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {links.map((link) => (
        <LinkCard
          key={link.id}
          link={link}
          categoryIndex={categoryIndex}
          editingLinkId={editingLinkId}
          editingLinkTitle={editingLinkTitle}
          deletingLinkId={deletingLinkId}
          onEdit={onEditLink}
          onDelete={onDeleteLink}
          onTitleChange={onTitleChange}
          onSaveTitle={(linkId, title) => onSaveTitle(linkId, title)}
          onCancelEdit={onCancelEdit}
          onKeyPress={onKeyPress}
        />
      ))}
    </div>
  );
};
