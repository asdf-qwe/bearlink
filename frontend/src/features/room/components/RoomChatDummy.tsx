import React from "react";

const dummyMessages = [
  {
    id: 1,
    user: "홍길동",
    color: "text-amber-700",
    message: "안녕하세요! 초대해주셔서 감사합니다.",
  },
  {
    id: 2,
    user: "김철수",
    color: "text-blue-700",
    message: "어서오세요! 곧 방에 입장하실 수 있어요.",
  },
  { id: 3, user: "이영희", color: "text-green-700", message: "환영합니다 😊" },
];

export const RoomChatDummy: React.FC = () => (
  <div className="mt-8 bg-white rounded-lg shadow-md p-4">
    <h3 className="text-xl font-semibold mb-2">채팅</h3>
    <div className="h-40 overflow-y-auto border rounded p-2 bg-gray-50 mb-2">
      {dummyMessages.map((msg) => (
        <div className="mb-2" key={msg.id}>
          <span className={`font-bold ${msg.color}`}>{msg.user}:</span>
          <span className="ml-2">{msg.message}</span>
        </div>
      ))}
    </div>
    <div className="flex">
      <input
        type="text"
        className="flex-1 border rounded-l px-3 py-1 focus:outline-none"
        placeholder="메시지를 입력하세요..."
        disabled
      />
      <button className="bg-amber-500 text-white px-4 py-1 rounded-r" disabled>
        전송
      </button>
    </div>
    <p className="text-xs text-gray-400 mt-1">* 채팅은 더미 데이터입니다.</p>
  </div>
);
