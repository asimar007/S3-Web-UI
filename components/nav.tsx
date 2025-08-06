"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Settings, Globe, Loader2 } from "lucide-react";
import CredentialEditModal from "@/components/credential-edit-modal";
import Image from "next/image";

const NavBar = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [corsLoading, setCorsLoading] = useState(false);
  const [corsMessage, setCorsMessage] = useState<string | null>(null);

  const handleUpdateComplete = () => {
    window.location.reload();
  };

  const handleCorsSetup = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (corsLoading) return; // Prevent multiple simultaneous calls

    setCorsLoading(true);
    setCorsMessage(null);

    const response = await fetch("/api/cors-setup", {
      method: "POST",
    });

    const data = await response.json();

    if (response.ok) {
      setCorsMessage("✅ CORS configured successfully!");
      setTimeout(() => setCorsMessage(null), 3000);
    } else {
      setCorsMessage(`❌ ${data.error || "CORS setup failed"}`);
      setTimeout(() => setCorsMessage(null), 5000);
    }

    setCorsLoading(false);
  };

  return (
    <>
      <nav className="relative z-20 bg-transparent">
        <div className="container mx-auto px-6 py-4">
          {/* CORS Status Message */}
          {corsMessage && (
            <div className="mb-4 p-3 rounded-lg bg-white/90 backdrop-blur-sm border text-sm text-center">
              {corsMessage}
            </div>
          )}

          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden shadow-sm">
                <Image
                  src="/images/S3.png"
                  alt="S3 Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">
                  S3 <span className="text-emerald-600">Web UI</span>
                </h1>
                <p className="text-xs text-slate-500 font-medium tracking-wide">
                  Storage Management Console
                </p>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* CORS Setup Button */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCorsSetup}
                disabled={corsLoading}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-white/50 transition-colors"
              >
                {corsLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Globe className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">
                  {corsLoading ? "Setting up..." : "Setup CORS"}
                </span>
              </Button>

              {/* Settings Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-white/50 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Edit</span>
              </Button>

              {/* User Button */}
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                    userButtonPopoverCard: "shadow-xl border-0",
                    userButtonPopoverActionButton: "hover:bg-amber-50",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </nav>

      <CredentialEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdateComplete={handleUpdateComplete}
      />
    </>
  );
};

export default NavBar;
