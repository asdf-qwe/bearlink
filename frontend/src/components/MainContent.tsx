"use client";

interface MainContentProps {
  children: React.ReactNode;
}

export default function MainContent({ children }: MainContentProps) {
  return (
    <div className="transition-all duration-300 min-h-screen flex-1">
      {children}
    </div>
  );
}
