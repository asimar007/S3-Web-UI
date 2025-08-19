"use client";

import { useState, useEffect } from "react";
import NavBar from "@/components/nav";
import FileExplorer from "@/components/file-explorer";
import CredentialSetup from "@/components/credential-setup";
import { Database } from "lucide-react";

export default function AuthenticatedApp() {
  const [hasCredentials, setHasCredentials] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const checkCredentials = async () => {
    try {
      const response = await fetch("/api/user/credentials");
      setHasCredentials(response.ok);
    } catch (error) {
      console.error("Failed to check credentials:", error);
      setHasCredentials(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkCredentials();
  }, []);

  const handleSetupComplete = () => {
    setHasCredentials(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin border-t-primary mx-auto"></div>
            <Database className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              Checking Credentials
            </h3>
            <p className="text-muted-foreground text-sm">
              Verifying your AWS configuration...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!hasCredentials) {
    return <CredentialSetup onSetupComplete={handleSetupComplete} />;
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-40 w-60 h-60 bg-primary/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-primary/4 rounded-full blur-2xl"></div>
      </div>

      <NavBar />

      <main className="relative z-10 w-full px-4 sm:px-6 pt-20 sm:pt-24 pb-8">
        {/* Hero Header Section */}
        <div className="mb-8 sm:mb-12 max-w-7xl mx-auto">
          <div className="text-center sm:text-left">
            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                S3 File Explorer
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl">
              <span className="text-primary font-medium">
                {" "}
                Stop wrestling with the AWS Console clunky interface
              </span>{" "}
              and manage your S3 buckets through a clean, friendly dashboard
              built for speed and productivity.
            </p>

            {/* Stats or Quick Actions */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 sm:mt-8 justify-center sm:justify-start">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-foreground">
                  Secure Connection
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-foreground">
                  Real-time Sync
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* File Explorer Container */}
        <div className="w-full max-w-7xl mx-auto">
          <div className="relative">
            {/* Decorative border */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/5 to-primary/20 rounded-2xl blur-xl"></div>

            {/* Main content */}
            <div className="relative bg-background/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-2xl shadow-primary/5">
              <FileExplorer />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
