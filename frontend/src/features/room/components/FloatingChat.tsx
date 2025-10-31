import React, { useEffect, useRef, useState } from "react";
import {
  connectToRoom,
  disconnectRoom,
  sendRoomMessage,
  getChatHistory,
  addLink,
} from "../service/roomChatService";
import { RoomMessageDto } from "../type/room";
import { MessageCircle, X, Send, Link } from "lucide-react";

interface FloatingChatProps {
  roomId: number;
  currentUserId: number;
  currentUserName: string;
  isOpen: boolean;
  onToggle: () => void;
  initialTab?: "chat" | "link";
}

export const FloatingChat: React.FC<FloatingChatProps> = ({
  roomId,
  currentUserId,
  currentUserName,
  isOpen,
  onToggle,
  initialTab = "chat",
}) => {
  const [messages, setMessages] = useState<RoomMessageDto[]>([]);
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState<"chat" | "link">(initialTab);
  const [linkForm, setLinkForm] = useState({ url: "", title: "" });
  const [linkError, setLinkError] = useState("");
  const [submittingLink, setSubmittingLink] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // initialTab이 변경되면 activeTab도 업데이트
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // 메시지 불러오기 및 실시간 구독
  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    getChatHistory(roomId).then((msgs) => {
      if (mounted) setMessages(msgs.reverse());
    });

    connectToRoom(roomId, (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      mounted = false;
      disconnectRoom();
    };
  }, [roomId, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const msg: RoomMessageDto = {
      roomId,
      senderId: currentUserId,
      senderName: currentUserName,
      type: "TALK",
      content: input,
    };
    sendRoomMessage(roomId, msg);
    setInput("");
  };

  const handleAddLink = async () => {
    if (!linkForm.url.trim()) return;

    setSubmittingLink(true);
    setLinkError("");

    try {
      await addLink(roomId, {
        url: linkForm.url.trim(),
        title: linkForm.title.trim() || linkForm.url.trim(),
        thumbnailImageUrl: "",
      });
      setLinkForm({ url: "", title: "" });
      setActiveTab("chat"); // 링크 추가 후 채팅 탭으로 돌아가기
    } catch (error) {
      setLinkError("링크 추가에 실패했습니다.");
    } finally {
      setSubmittingLink(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-14 h-14 bg-amber-600 hover:bg-amber-700 text-white rounded-full shadow-lg flex items-center justify-center z-50 transition-all duration-200 hover:scale-105"
        aria-label="채팅 열기"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* 채팅 헤더 */}
      <div className="bg-amber-600 text-white px-4 py-3 rounded-t-lg shadow-lg">
        {/* 탭 버튼 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex items-center space-x-1 px-2 py-1 rounded text-sm transition-colors ${
                activeTab === "chat" ? "bg-amber-700" : "hover:bg-amber-700"
              }`}
            >
              <MessageCircle size={16} />
              <span>채팅</span>
            </button>
            <button
              onClick={() => setActiveTab("link")}
              className={`flex items-center space-x-1 px-2 py-1 rounded text-sm transition-colors ${
                activeTab === "link" ? "bg-amber-700" : "hover:bg-amber-700"
              }`}
            >
              <Link size={16} />
              <span>링크</span>
            </button>
          </div>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-amber-700 rounded transition-colors"
            aria-label="닫기"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* 본문 */}
      <div className="bg-white w-80 h-96 flex flex-col shadow-lg rounded-b-lg">
        {activeTab === "chat" ? (
          <>
            {/* 메시지 목록 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages
                .filter((msg) => msg.type === "TALK")
                .map((msg, idx) => {
                  const isMine = msg.senderId === currentUserId;
                  return (
                    <div
                      key={idx}
                      className={`flex ${
                        isMine ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[75%] px-3 py-2 rounded-lg shadow-sm break-words whitespace-pre-line ${
                          isMine
                            ? "bg-amber-100 text-amber-900"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <div
                          className={`text-xs font-semibold mb-1 ${
                            isMine ? "text-amber-700" : "text-blue-700"
                          }`}
                        >
                          {msg.senderName}
                        </div>
                        <div className="text-sm">{msg.content}</div>
                      </div>
                    </div>
                  );
                })}
              <div ref={messagesEndRef} />
            </div>

            {/* 메시지 입력 */}
            <div className="border-t border-gray-200 p-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                  placeholder="메시지를 입력하세요..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="메시지 전송"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* 링크 추가 폼 */}
            <div className="flex-1 p-4">
              {/* 에러 메시지 */}
              {linkError && (
                <div className="text-red-500 mb-4 text-sm bg-red-50 p-3 rounded">
                  {linkError}
                </div>
              )}

              {/* 폼 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-amber-700 mb-1">
                    URL
                  </label>
                  <input
                    type="url"
                    value={linkForm.url}
                    onChange={(e) =>
                      setLinkForm((f) => ({ ...f, url: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" &&
                        !submittingLink &&
                        linkForm.url.trim()
                      ) {
                        handleAddLink();
                      }
                    }}
                    placeholder="https://example.com"
                    className="w-full p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                    disabled={submittingLink}
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-700 mb-1">
                    제목
                  </label>
                  <input
                    type="text"
                    value={linkForm.title}
                    onChange={(e) =>
                      setLinkForm((f) => ({ ...f, title: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" &&
                        !submittingLink &&
                        linkForm.url.trim()
                      ) {
                        handleAddLink();
                      }
                    }}
                    placeholder="제목 (선택사항)"
                    className="w-full p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                    disabled={submittingLink}
                  />
                </div>
              </div>
            </div>

            {/* 링크 추가 버튼 */}
            <div className="border-t border-gray-200 p-3">
              <div className="flex space-x-2">
                <button
                  onClick={handleAddLink}
                  disabled={!linkForm.url.trim() || submittingLink}
                  className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  {submittingLink && (
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
                  <span>{submittingLink ? "추가 중..." : "링크 추가"}</span>
                </button>
                <button
                  onClick={() => {
                    setLinkForm({ url: "", title: "" });
                    setLinkError("");
                    onToggle(); // 채팅창을 닫음
                  }}
                  className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  disabled={submittingLink}
                >
                  취소
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
