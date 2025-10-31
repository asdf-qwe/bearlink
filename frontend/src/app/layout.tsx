import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

// 폰트 설정
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BearLink",
  description: "Link sharing platform",
  icons: {
    icon: "/bear_icon.ico",
    shortcut: "/bear_icon.ico",
    apple: "/bear_icon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/bear_icon.ico" sizes="any" />
        <link rel="icon" href="/bear_icon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/bear_icon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ backgroundColor: "#FFFBEB" }}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
