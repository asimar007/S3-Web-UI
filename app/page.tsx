import { currentUser } from "@clerk/nextjs/server";
import { HeroSection } from "@/components/blocks/hero-section-1";
import FooterSection from "@/components/ui/footer";
import AuthenticatedApp from "@/components/AuthenticatedApp";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "S3 Buddy - Modern AWS S3 File Manager",
  description:
    "Transform your AWS S3 experience with S3 Buddy. Modern, secure file manager with enterprise-grade security, beautiful interface, and intuitive S3 bucket management. Free alternative to AWS Console.",
  keywords: [
    "AWS S3 manager",
    "S3 file manager",
    "AWS console alternative",
    "cloud storage interface",
    "S3 bucket manager",
    "file upload tool",
    "AWS S3 GUI",
    "enterprise file manager",
  ],
  openGraph: {
    title: "S3 Buddy - Modern AWS S3 File Manager",
    description:
      "Transform your AWS S3 experience with S3 Buddy. Modern, secure file manager with enterprise-grade security and beautiful interface.",
    type: "website",
    url: "https://s3buddy.icu",
  },
  alternates: {
    canonical: "https://s3buddy.icu",
  },
};

export default async function HomePage() {
  const user = await currentUser();

  return (
    <>
      {!user ? (
        <>
          <HeroSection />
          <FooterSection />
        </>
      ) : (
        <AuthenticatedApp />
      )}
    </>
  );
}
