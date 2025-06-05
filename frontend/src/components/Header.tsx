"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isActive = (path: string) => {
    return pathname === path
      ? "text-white border-b-2 border-amber-200"
      : "text-amber-100 hover:text-white";
  };

  return (    <header
      className="shadow-md fixed top-0 left-0 right-0 z-50 border-b border-stone-300"
      style={{ 
        backgroundImage: "url('/namu.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-white" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>
                BearLink
              </Link>
            </div>
            <nav className="ml-10 flex items-center space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive(
                  "/"
                )}`}
              >
                홈
              </Link>
              <Link
                href="/linkRoom"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive(
                  "/linkRoom"
                )}`}
              >
                링크룸
              </Link>
              <Link
                href="/myPage"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive(
                  "/myPage"
                )}`}
              >
                마이페이지
              </Link>
            </nav>
          </div>
          <div className="flex items-center">            <button className="p-2 rounded-full text-amber-100 hover:text-white focus:outline-none">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <div className="ml-3 relative">
              <div>                <button className="p-1 rounded-full text-amber-100 hover:text-white focus:outline-none">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
