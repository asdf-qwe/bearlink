import React, { useState } from "react";

interface InviteUserFormProps {
  onInvite: (email: string) => Promise<boolean | undefined>;
  error: string | null;
}

export const InviteUserForm: React.FC<InviteUserFormProps> = ({
  onInvite,
  error,
}) => {
  const [email, setEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setInviting(true);
    try {
      const success = await onInvite(email.trim());
      if (success) {
        setEmail("");
        setShowForm(false);
      }
    } finally {
      setInviting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setShowForm(false);
      setEmail("");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {showForm ? (
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold mb-4">사용자 초대하기</h2>
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="초대할 사용자의 이메일 입력"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              autoFocus
              disabled={inviting}
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              disabled={inviting}
            >
              취소
            </button>
            <button
              type="submit"
              className={`px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors ${
                inviting ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={inviting}
            >
              {inviting ? "초대중..." : "초대하기"}
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 flex items-center justify-center bg-amber-100 text-amber-700 rounded-md hover:bg-amber-200 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 00-6 6h12a6 6 0 00-6-6z" />
            <path d="M16 8a2 2 0 10-4 0v1h4V8z" />
          </svg>
          사용자 초대하기
        </button>
      )}
    </div>
  );
};
