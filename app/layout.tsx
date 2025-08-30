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
  title: {
    default: "S3 Buddy - Modern AWS S3 File Manager",
    template: "%s | S3 Buddy",
  },
  description:
    "Modern, secure AWS S3 file manager with enterprise-grade security. Beautiful interface for S3 bucket management, file uploads, downloads, and organization. Alternative to AWS Console.",
  keywords: [
    "AWS S3",
    "S3 file manager",
    "AWS console alternative",
    "S3 bucket manager",
    "cloud storage",
    "file upload",
    "AWS tools",
    "S3 interface",
    "enterprise security",
    "Next.js",
  ],
  authors: [{ name: "S3 Buddy Team" }],
  creator: "S3 Buddy",
  publisher: "S3 Buddy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://s3buddy.icu"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://s3buddy.icu",
    title: "S3 Buddy - Modern AWS S3 File Manager",
    description:
      "Modern, secure AWS S3 file manager with enterprise-grade security. Beautiful interface for S3 bucket management, file uploads, downloads, and organization.",
    siteName: "S3 Buddy",
    images: [
      {
        url: "https://opengraph.b-cdn.net/production/images/992c0af6-2106-44d6-934d-c47c764bb3d3.png?token=T6m0AAsrhYSGbotyRm_qBO-0wQBpeK1xTufnz1oqC5I&height=800&width=1200&expires=33292574694",
        width: 1200,
        height: 800,
        alt: "S3 Buddy - Modern AWS S3 File Manager Interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "S3 Buddy - Modern AWS S3 File Manager",
    description:
      "Modern, secure AWS S3 file manager with enterprise-grade security. Beautiful interface for S3 bucket management.",
    images: [
      "https://opengraph.b-cdn.net/production/images/992c0af6-2106-44d6-934d-c47c764bb3d3.png?token=T6m0AAsrhYSGbotyRm_qBO-0wQBpeK1xTufnz1oqC5I&height=800&width=1200&expires=33292574694",
    ],
    creator: "@asim",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <hedy
          <StructuredData />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
        >
          <div className="min-h-screen w-full bg-background">{children}</div>
        </body>
      </html>
    </ClerkProvider>
  );
}
