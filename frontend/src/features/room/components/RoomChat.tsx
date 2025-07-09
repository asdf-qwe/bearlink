import React, { useEffect, useRef, useState } from "react";
import {
  connectToRoom,
  disconnectRoom,
  sendRoomMessage,
  getChatHistory,
} from "../service/roomChatService";
import { RoomMessageDto, MessageType } from "../type/room";

interface RoomChatProps {
  roomId: number;
  currentUserId: number;
  currentUserName: string;
}

export const RoomChat: React.FC<RoomChatProps> = ({
  roomId,
  currentUserId,
  currentUserName,
}) => {
  const [messages, setMessages] = useState<RoomMessageDto[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 메시지 불러오기 및 실시간 구독
  useEffect(() => {
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
  }, [roomId]);

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

  return (
    <div className="mt-6 bg-white rounded-lg shadow-md p-4">
      <div className="h-40 overflow-y-auto border rounded p-2 bg-gray-50 mb-2">
        {messages.map((msg, idx) => {
          const isMine = msg.senderId === currentUserId;
          return (
            <div
              key={idx}
              className={`mb-2 flex ${
                isMine ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] px-3 py-2 rounded-lg shadow-sm break-words whitespace-pre-line ${
                  isMine
                    ? "bg-amber-100 text-amber-900 ml-8 text-right"
                    : "bg-gray-100 text-gray-800 mr-8 text-left"
                }`}
              >
                <span
                  className={`font-bold ${
                    isMine ? "text-amber-700" : "text-blue-700"
                  }`}
                >
                  {msg.senderName}
                </span>
                <span className="ml-2">{msg.content}</span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-1 border rounded-l px-3 py-1 focus:outline-none"
          placeholder="메시지를 입력하세요..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <button
          className="bg-amber-500 text-white px-4 py-1 rounded-r"
          onClick={handleSend}
        >
          전송
        </button>
      </div>
    </div>
  );
};
