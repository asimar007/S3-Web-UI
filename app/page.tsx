import { currentUser } from "@clerk/nextjs/server";
import { Suspense } from "react";
import LandingPage from "@/components/LandingPage";
import AuthenticatedApp from "@/components/AuthenticatedApp";

// Loading component for Suspense
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-700 font-medium">Loading S3 Explorer...</p>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const user = await currentUser();

  return (
    <Suspense fallback={<LoadingScreen />}>
      {!user ? <LandingPage /> : <AuthenticatedApp />}
    </Suspense>
  );
}
