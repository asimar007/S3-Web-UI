import type { Metadata } from "next";

const BASE_URL = "https://s3buddy.icu";
const OG_IMAGE = "/images/meta.png";
const TITLE = "S3 Buddy - Modern AWS S3 File Manager";
const DESCRIPTION =
  "Modern, secure AWS S3 file manager with enterprise-grade security. Beautiful interface for S3 bucket management, file uploads, downloads, and organization. Alternative to AWS Console.";

export const siteMetadata: Metadata = {
  title: {
    default: TITLE,
    template: "%s | S3 Buddy",
  },
  description: DESCRIPTION,
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
  verification: {
    google: "BjciYxkrtQ--z84rySdvjFM6KDQG7oZ753FgWd0B2m0",
  },
  metadataBase: new URL(BASE_URL),
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
    url: BASE_URL,
    title: TITLE,
    description:
      "Modern, secure AWS S3 file manager with enterprise-grade security. Beautiful interface for S3 bucket management, file uploads, downloads, and organization.",
    siteName: "S3 Buddy",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: TITLE,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description:
      "Modern, secure AWS S3 file manager with enterprise-grade security. Beautiful interface for S3 bucket management.",
    images: [OG_IMAGE],
    creator: "Asim",
  },
};

export const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "S3 Buddy",
  description: DESCRIPTION,
  url: BASE_URL,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web Browser",
  author: {
    "@type": "Individual",
    name: "Asim SK",
    url: "https://github.com/asimar007/S3-Web-UI",
  },
  softwareVersion: "1.0",
  datePublished: "2025",
  featureList: [
    "AWS S3 bucket management",
    "Secure file uploads and downloads",
    "Enterprise-grade security",
    "Modern user interface",
    "Drag and drop file uploads",
    "Folder organization",
    "Real-time progress tracking",
  ],
};
