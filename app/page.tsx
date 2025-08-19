import { currentUser } from "@clerk/nextjs/server";
import { Suspense } from "react";
import { HeroSection } from "@/components/blocks/hero-section-1";
import FooterSection from "@/components/ui/footer";
import AuthenticatedApp from "@/components/AuthenticatedApp";

// Loading component for Suspense
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin border-t-primary mx-auto"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary">
            🚀
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            Loading S3 Buddy
          </h3>
          <p className="text-muted-foreground text-sm">
            Preparing your storage dashboard...
          </p>
        </div>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const user = await currentUser();

  return (
    <Suspense fallback={<LoadingScreen />}>
      {!user ? (
        <>
          <HeroSection />
          <FooterSection />
        </>
      ) : (
        <AuthenticatedApp />
      )}
    </Suspense>
  );
}
