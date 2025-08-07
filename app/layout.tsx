import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "S3 Buddy",
  description:
    "Manage your AWS S3 buckets with enterprise-grade security and beautiful interface.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div className="min-h-screen w-full bg-white relative">
            {/* Amber Glow Background */}
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #f59e0b 100%)`,
                backgroundSize: "100% 100%",
              }}
            />

            {/* Content */}
            <div className="relative z-10">{children}</div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
