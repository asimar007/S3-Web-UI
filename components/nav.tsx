"use client";

import { useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Settings, Globe, Loader2, Menu, X, Info } from "lucide-react";
import CredentialEditModal from "@/components/credential-edit-modal";
import Image from "next/image";
import { HyperText } from "@/components/magicui/hyper-text";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";

const NavBar = () => {
  const { user } = useUser();
  const [menuState, setMenuState] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [corsLoading, setCorsLoading] = useState(false);
  const [corsMessage, setCorsMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleUpdateComplete = () => {
    window.location.reload();
  };

  const handleCorsSetup = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (corsLoading) return;

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
      <header>
        <nav
          data-state={menuState ? "active" : ""}
          className="fixed z-20 w-full px-2 group"
        >
          <div
            className={cn(
              "mx-auto mt-2 max-w-6xl px-4 sm:px-6 transition-all duration-200 ease-out lg:px-12",
              isScrolled &&
                "bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5",
            )}
          >
            {/* CORS Status Message */}
            {corsMessage && user && (
              <div className="mb-4 p-3 rounded-lg bg-background/90 backdrop-blur-sm border text-sm text-center text-foreground">
                {corsMessage}
              </div>
            )}
            {/* Navbar */}
            <div className="relative flex flex-wrap items-center justify-between gap-4 sm:gap-6 py-3 lg:gap-0 lg:py-4">
              <div className="flex w-full justify-between lg:w-auto">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 sm:gap-3"
                >
                  <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-xl overflow-hidden">
                    <Image
                      src="/images/S3.png"
                      alt="S3 Logo"
                      width={32}
                      height={32}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-base sm:text-lg font-bold text-foreground tracking-tight leading-none">
                      <HyperText>S3 Buddy</HyperText>
                    </h1>
                  </div>
                </Link>

                {/* Mobile menu button - show for both authenticated and unauthenticated users */}
                <button
                  onClick={() => setMenuState(!menuState)}
                  aria-label={menuState ? "Close Menu" : "Open Menu"}
                  className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
                >
                  <Menu className="in-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-5 sm:size-6 duration-200" />
                  <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-5 sm:size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                </button>
              </div>

              {/* Right Section - Desktop */}
              <div className="hidden lg:flex lg:items-center lg:gap-4">
                {user ? (
                  // Authenticated user buttons - Desktop
                  <>
                    {/* CORS Info Tooltip - LEFT side */}
                    <div className="relative">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="p-1 h-9 w-6 text-muted-foreground hover:text-accent-foreground hover:bg-background/50 transition-colors"
                            >
                              <Info className="w-6 h-6" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" align="start">
                            <div className="flex flex-col gap-1 max-w-[250px]">
                              <div className="text-sm font-medium">
                                What is CORS Setup?
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Just click and go - automatic CORS setup in
                                seconds! That&apos;s it! 🎉
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleCorsSetup}
                      disabled={corsLoading}
                      className="flex items-center gap-2 text-muted-foreground hover:text-accent-foreground hover:bg-background/50 transition-colors"
                    >
                      {corsLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Globe className="w-4 h-4" />
                      )}
                      <span>
                        {corsLoading ? "Setting up..." : "Setup CORS"}
                      </span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditModalOpen(true)}
                      className="flex items-center gap-2 text-muted-foreground hover:text-accent-foreground hover:bg-background/50 transition-colors"
                      title="Edit your AWS credentials and S3 bucket configuration"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Edit</span>
                    </Button>

                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "w-8 h-8",
                          userButtonPopoverCard: "shadow-xl border-0",
                          userButtonPopoverActionButton: "hover:bg-primary/10",
                        },
                      }}
                    />
                  </>
                ) : (
                  // Unauthenticated user buttons - Desktop
                  <>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className={cn(isScrolled && "lg:hidden")}
                    >
                      <SignInButton mode="modal">
                        <span>Login</span>
                      </SignInButton>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      className={cn(isScrolled ? "lg:inline-flex" : "hidden")}
                    >
                      <SignInButton mode="modal">
                        <span>Get Started</span>
                      </SignInButton>
                    </Button>
                  </>
                )}
              </div>

              {/* Mobile Menu */}
              <div className="bg-background group-data-[state=active]:block mb-6 hidden w-full rounded-3xl border p-4 sm:p-6 shadow-2xl shadow-zinc-300/20 lg:hidden dark:shadow-none">
                {/* Mobile Menu Actions */}
                <div className="flex flex-col space-y-3">
                  {user ? (
                    // Authenticated user buttons - Mobile
                    <>
                      {/* CORS Info Tooltip - Mobile RIGHT side */}
                      <div className="flex items-center gap-2 w-full">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            handleCorsSetup(e);
                            setMenuState(false);
                          }}
                          disabled={corsLoading}
                          className="flex items-center justify-start gap-3 text-muted-foreground hover:text-accent-foreground hover:bg-background/50 transition-colors flex-1 py-3"
                        >
                          {corsLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Globe className="w-5 h-5" />
                          )}
                          <span className="text-sm font-medium">
                            {corsLoading ? "Setting up CORS..." : "Setup CORS"}
                          </span>
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsEditModalOpen(true);
                          setMenuState(false);
                        }}
                        className="flex items-center justify-start gap-3 text-muted-foreground hover:text-accent-foreground hover:bg-background/50 transition-colors w-full py-3"
                        title="Edit your AWS credentials and S3 bucket configuration"
                      >
                        <Settings className="w-5 h-5" />
                        <span className="text-sm font-medium">
                          Edit Credentials
                        </span>
                      </Button>

                      <div className="flex items-center justify-start gap-3 py-3 px-3">
                        <UserButton
                          appearance={{
                            elements: {
                              avatarBox: "w-8 h-8",
                              userButtonPopoverCard: "shadow-xl border-0",
                              userButtonPopoverActionButton:
                                "hover:bg-primary/10",
                            },
                          }}
                        />
                        <span className="text-sm font-medium text-muted-foreground">
                          Profile
                        </span>
                      </div>
                    </>
                  ) : (
                    // Unauthenticated user buttons - Mobile
                    <>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => setMenuState(false)}
                      >
                        <SignInButton mode="modal">
                          <span>Login</span>
                        </SignInButton>
                      </Button>
                      <Button
                        asChild
                        size="sm"
                        className="w-full"
                        onClick={() => setMenuState(false)}
                      >
                        <SignInButton mode="modal">
                          <span>Get Started</span>
                        </SignInButton>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {user && (
        <CredentialEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdateComplete={handleUpdateComplete}
        />
      )}
    </>
  );
};

export default NavBar;
