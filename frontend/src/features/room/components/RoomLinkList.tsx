import React, { useState } from "react";
import { RoomLinkListDto } from "../type/room";
import { updateLink, deleteLink } from "../service/roomChatService";
import { RoomLinkListView } from "./RoomLinkListView";

interface RoomLinkListProps {
  links: RoomLinkListDto[];
  loading: boolean;
  roomId: number;
  currentUserId: number;
}

export const RoomLinkList: React.FC<RoomLinkListProps> = ({
  links,
  loading,
  roomId,
  currentUserId,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ title: "" });
  const [submitting, setSubmitting] = useState(false);

  const startEdit = (link: RoomLinkListDto) => {
    setEditingId(link.id);
    setEditForm({ title: link.title });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("이 링크를 삭제하시겠습니까?")) return;

    setSubmitting(true);
    try {
      await deleteLink(roomId, id);
    } catch (error) {
      console.error("링크 삭제 실패:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-3">
          <svg
            className="h-6 w-6 animate-spin text-amber-600"
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
    );
  }

  return (
    <div className="p-0 mb-0">
      <h2 className="text-xl font-semibold mb-4">공유된 링크</h2>

      {/* 링크 목록 */}
      <div className="mb-6">
        <RoomLinkListView
          links={links}
          editingLinkId={editingId}
          editingLinkTitle={editForm.title}
          submittingId={submitting ? editingId : null}
          onEditLink={startEdit}
          onDeleteLink={handleDelete}
          onTitleChange={(title: string) =>
            setEditForm((f) => ({ ...f, title }))
          }
          onSaveTitle={async (id: number, title: string) => {
            setEditForm((f) => ({ ...f, title }));
            setSubmitting(true);
            try {
              const linkToUpdate = links.find((link) => link.id === id);
              if (linkToUpdate) {
                await updateLink(roomId, id, {
                  title,
                  url: linkToUpdate.url,
                  thumbnailImageUrl: linkToUpdate.thumbnailImageUrl ?? "",
                });
              }
              setEditingId(null);
            } finally {
              setSubmitting(false);
            }
          }}
          onCancelEdit={() => setEditingId(null)}
          onKeyPress={() => {}}
        />
      </div>
    </div>
  );
};
