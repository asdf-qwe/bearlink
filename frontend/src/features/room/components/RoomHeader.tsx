import React from "react";

interface RoomHeaderProps {
  roomName: string;
  editingRoom: boolean;
  error: string | null;
  onEditStart: () => void;
  onRoomNameChange: (name: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export const RoomHeader: React.FC<RoomHeaderProps> = ({
  roomName,
  editingRoom,
  error,
  onEditStart,
  onRoomNameChange,
  onSave,
  onCancel,
  onKeyPress,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between">
        {editingRoom ? (
          <div className="flex flex-col w-full">
            <div className="flex items-center">
              <input
                type="text"
                value={roomName}
                onChange={(e) => onRoomNameChange(e.target.value)}
                onKeyDown={onKeyPress}
                className="w-full p-2 mr-2 text-2xl font-bold border-b-2 border-amber-400 focus:outline-none focus:border-amber-600"
                autoFocus
                placeholder="링크룸 이름 입력"
              />
              <button
                onClick={onSave}
                className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-md transition-colors"
              >
                저장
              </button>
              <button
                onClick={onCancel}
                className="ml-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md transition-colors"
              >
                취소
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        ) : (
          <>
            <h1
              className="text-2xl font-bold cursor-pointer hover:text-amber-600"
              onClick={onEditStart}
            >
              {roomName}
              <span className="ml-2 text-gray-400 text-sm hidden md:inline">
                (클릭하여 이름 변경)
              </span>
            </h1>
            <button
              onClick={onEditStart}
              className="text-amber-500 hover:text-amber-700 transition-colors"
              aria-label="링크룸 이름 편집"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
