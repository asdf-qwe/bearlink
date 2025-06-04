"use client";

import { useSidebar } from "@/context/SidebarContext";

interface MainContentProps {
  children: React.ReactNode;
}

export default function MainContent({ children }: MainContentProps) {
  const { isOpen } = useSidebar();
  return (
    <div
      className={`transition-all duration-300 min-h-screen pt-16 ${
        isOpen ? "ml-52" : "ml-16"
      }`}
    >
      {children}
    </div>
  );
}
