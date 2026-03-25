import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { VaultProvider } from "@/components/vault-provider";
import VaultUnlocker from "@/components/vault-unlocker";
import { siteMetadata, structuredData } from "@/lib/metadata";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
        >
          <VaultProvider>
            <VaultUnlocker />
            <div className="min-h-screen w-full bg-background">{children}</div>
            <Toaster />
          </VaultProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
