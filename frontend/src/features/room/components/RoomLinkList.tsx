import React, { useState } from "react";
import { RoomChat } from "./RoomChat";
import { RoomLinkListDto, RoomLinkDto } from "../type/room";
import { addLink, updateLink, deleteLink } from "../service/roomChatService";
import { RoomLinkListView } from "./RoomLinkListView";

interface RoomLinkListProps {
  links: RoomLinkListDto[];
  loading: boolean;
  roomId: number;
  currentUserId: number;
  currentUserName: string;
}

export const RoomLinkList: React.FC<RoomLinkListProps> = ({
  links,
  loading,
  roomId,
  currentUserId,
  currentUserName,
}) => {
  // 링크 추가 폼 항상 보이도록 변경
  const [form, setForm] = useState<{ title: string; url: string }>({
    title: "",
    url: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{ title: string; url: string }>({
    title: "",
    url: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 새 링크 추가
  const handleAdd = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!form.url.trim()) {
      setError("URL을 입력하세요.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await addLink(roomId, form as RoomLinkDto); // 백엔드에서 썸네일 자동 처리
      setForm({ title: "", url: "" });
    } catch (err) {
      setError("링크 추가에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };
  const handleCancelAdd = () => {
    setForm({ title: "", url: "" });
    setError(null);
  };

  // 링크 수정 시작
  const startEdit = (link: RoomLinkListDto) => {
    setEditingId(link.id);
    setEditForm({ title: link.title, url: link.url });
  };

  // 링크 수정 저장
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId === null) return;
    setSubmitting(true);
    try {
      await updateLink(roomId, editingId, editForm as RoomLinkDto);
      setEditingId(null);
    } finally {
      setSubmitting(false);
    }
  };

  // 링크 삭제
  const handleDelete = async (id: number) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    setSubmitting(true);
    try {
      await deleteLink(roomId, id);
    } finally {
      setSubmitting(false);
    }
  };
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
          onKeyPress={(e: React.KeyboardEvent, id: number) => {
            if (e.key === "Enter") {
              const linkToUpdate = links.find((link) => link.id === id);
              if (linkToUpdate) {
                setSubmitting(true);
                updateLink(roomId, id, {
                  title: editForm.title,
                  url: linkToUpdate.url,
                  thumbnailImageUrl: linkToUpdate.thumbnailImageUrl ?? "",
                })
                  .then(() => setEditingId(null))
                  .finally(() => setSubmitting(false));
              }
            } else if (e.key === "Escape") {
              setEditingId(null);
            }
          }}
        />
      </div>

      {/* 링크 목록 아래에 채팅과 추가폼을 가로로 배치 (빈 공간 최소화, 높이 맞춤) */}
      <div className="flex flex-row gap-4 items-stretch mb-0">
        {/* 채팅 영역 */}
        <div className="flex-6 min-w-0 w-0 flex-grow-[6] flex flex-col">
          <div className="bg-white rounded-lg p-0 h-full flex flex-col">
            <RoomChat
              roomId={roomId}
              currentUserId={currentUserId}
              currentUserName={currentUserName}
            />
          </div>
        </div>
        {/* 링크 추가 폼 영역 - 채팅과 높이 맞춤 */}
        <div className="flex-4 min-w-[320px] w-0 flex-grow-[4] flex flex-col">
          <div className="bg-white rounded-lg p-6 h-full flex flex-col justify-between">
            <div
              className="flex flex-col justify-start flex-1 mb-2"
              style={{ minHeight: 0 }}
            >
              <div className="flex items-end justify-between mb-4">
                <h3 className="text-lg font-semibold text-amber-900">
                  새 링크 추가
                </h3>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={handleAdd}
                    disabled={!form.url.trim() || submitting}
                    className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting && (
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
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
                    )}
                    <span>{submitting ? "추가 중..." : "추가"}</span>
                  </button>
                  <button
                    onClick={handleCancelAdd}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    disabled={submitting}
                  >
                    취소
                  </button>
                </div>
              </div>
              {error && (
                <div className="text-red-500 mb-2 text-sm">{error}</div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-amber-700 mb-1">
                    URL
                  </label>
                  <input
                    type="url"
                    value={form.url}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, url: e.target.value }))
                    }
                    placeholder="https://example.com"
                    className="w-full p-2 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                    disabled={submitting}
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-700 mb-1">
                    제목
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                    placeholder="제목을 입력해주세요"
                    className="w-full p-2 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                    disabled={submitting}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
