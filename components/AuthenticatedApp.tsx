"use client";

import { useState, useEffect } from "react";
import NavBar from "@/components/nav";
import FileExplorer from "@/components/file-explorer";
import CredentialSetup from "@/components/credential-setup";

export default function AuthenticatedApp() {
  const [hasCredentials, setHasCredentials] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const checkCredentials = async () => {
    const response = await fetch("/api/user/credentials");
    setHasCredentials(response.ok);
    setLoading(false);
  };

  useEffect(() => {
    checkCredentials();
  }, []);

  const handleSetupComplete = () => {
    setHasCredentials(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading S3 Explorer...</p>
        </div>
      </div>
    );
  }

  if (!hasCredentials) {
    return <CredentialSetup onSetupComplete={handleSetupComplete} />;
  }

  return (
    <>
      <NavBar />
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            S3 File Explorer
          </h2>
          <p className="text-gray-700 text-lg">
            Browse and manage your S3 bucket contents
          </p>
        </div>
        <FileExplorer />
      </main>
    </>
  );
}
