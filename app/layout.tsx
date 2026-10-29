import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "spaces. • Frozen Mist Neo-Memphis Bento Asset Gateway",
  description: "Fair allocation of government college auditoriums, labs, and sports complexes for community good. Replicating the high-contrast Neo-Memphis Bento aesthetic with the Frozen Mist palette.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FCF8D8] text-[#1C1D1A]">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
