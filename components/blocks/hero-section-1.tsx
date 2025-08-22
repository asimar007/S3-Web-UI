"use client";

import React from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Shield,
  Cloud,
  Zap,
  Upload,
  Download,
  Lock,
  Trash2,
  FolderOpen,
  Users,
  BarChart3,
  Globe,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { SignInButton } from "@clerk/nextjs";
import { HyperText } from "@/components/magicui/hyper-text";
import { Lens } from "@/components/magicui/lens";
import { Highlighter } from "@/components/magicui/highlighter";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring" as const,
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

export function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden">
        <div
          aria-hidden
          className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block"
        >
          <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="h-[80rem] -translate-y-[350px] absolute left-0 top-0 w-56 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
        </div>
        <section>
          <div className="relative pt-24 md:pt-36">
            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      delayChildren: 1,
                    },
                  },
                },
                item: {
                  hidden: {
                    opacity: 0,
                    y: 20,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: "spring" as const,
                      bounce: 0.3,
                      duration: 2,
                    },
                  },
                },
              }}
              className="absolute inset-0 -z-20"
            >
              <img
                src="https://ik.imagekit.io/lrigu76hy/tailark/night-background.jpg?updatedAt=1745733451120"
                alt="background"
                className="absolute inset-x-0 top-56 -z-20 hidden lg:top-32 dark:block"
                width="3276"
                height="4095"
              />
            </AnimatedGroup>
            <div
              aria-hidden
              className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]"
            />
            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                <AnimatedGroup variants={{ item: transitionVariants.item }}>
                  <h1 className="mt-8 max-w-4xl mx-auto text-balance text-6xl md:text-7xl lg:mt-16 xl:text-[5.25rem]">
                    S3 File Explorer
                  </h1>
                  <p className="mx-auto mt-8 max-w-2xl text-balance text-lg">
                    Skip the{" "}
                    <Highlighter action="highlight" color="#FF9800">
                      clunky AWS Console
                    </Highlighter>{" "}
                    — manage your S3 buckets with a{" "}
                    <Highlighter action="underline" color="#10B981">
                      clean, intuitive dashboard
                    </Highlighter>{" "}
                    designed for speed and productivity.
                  </p>
                </AnimatedGroup>

                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.75,
                        },
                      },
                    },
                    item: transitionVariants.item,
                  }}
                  className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row"
                >
                  <div
                    key={1}
                    className="bg-foreground/10 rounded-[14px] border p-0.5"
                  >
                    <SignInButton mode="modal">
                      <Button
                        asChild
                        size="lg"
                        className="rounded-xl px-5 text-base"
                      >
                        <Link href="#link">
                          <span className="text-nowrap">
                            Start Managing Files
                          </span>
                        </Link>
                      </Button>
                    </SignInButton>
                  </div>
                </AnimatedGroup>
              </div>
            </div>

            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.75,
                    },
                  },
                },
                item: transitionVariants.item,
              }}
            >
              <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                <div
                  aria-hidden
                  className="bg-gradient-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
                />
                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
                  <Lens>
                    <Image
                      className="bg-background aspect-15/8 relative hidden rounded-2xl dark:block"
                      src="/images/file-explorer.png"
                      alt="app screen"
                      width={2700}
                      height={1440}
                      priority={false}
                      quality={75}
                    />
                  </Lens>
                </div>
              </div>
            </AnimatedGroup>
          </div>
        </section>

        {/* Features Grid */}
        <section
          id="features-section"
          className="relative py-12 bg-background/50"
        >
          <div className="mx-auto max-w-7xl px-6">
            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 0.3,
                    },
                  },
                },
                item: transitionVariants.item,
              }}
            >
              <div className="text-center mb-16">
                <HyperText className="text-3xl md:text-4xl font-bold mb-4">
                  Advanced S3 Management Made Simple
                </HyperText>
                <p className="text-lg text-white max-w-2xl mx-auto">
                  With our trusted platform, you can safely and efficiently
                  handle all your S3 storage
                  <Highlighter action="highlight" color="#3B82F6">
                    {" "}
                    tasks, making your work faster and easier
                  </Highlighter>
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Security First */}
                <Card className="relative group overflow-hidden p-8 hover:shadow-xl transition-all duration-500">
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Shield className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-foreground">
                      AES-256 Encryption
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Your AWS credentials are encrypted with military-grade
                      AES-256 before storage. Zero-trust architecture ensures
                      maximum security.
                    </p>
                  </div>
                </Card>

                {/* Performance */}
                <Card className="relative group overflow-hidden p-8 hover:shadow-xl transition-all duration-500">
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Zap className="w-7 h-7 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-foreground">
                      Lightning Fast
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Built with Next.js 15 and React 19. Turbopack-powered
                      builds and serverless architecture for optimal
                      performance.
                    </p>
                  </div>
                </Card>

                {/* AWS Native */}
                <Card className="relative group overflow-hidden p-8 hover:shadow-xl transition-all duration-500">
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Cloud className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-foreground">
                      AWS Native Integration
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Direct S3 API integration with AWS SDK v3. Presigned URLs,
                      secure uploads, and real-time bucket management.
                    </p>
                  </div>
                </Card>

                {/* Modern UI */}
                <Card className="relative group overflow-hidden p-8 hover:shadow-xl transition-all duration-500">
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Globe className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-foreground">
                      Modern Interface
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Beautiful, responsive design with Tailwind CSS v4. Dark
                      mode support and smooth animations powered by Framer
                      Motion.
                    </p>
                  </div>
                </Card>

                {/* Enterprise Ready */}
                <Card className="relative group overflow-hidden p-8 hover:shadow-xl transition-all duration-500">
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-7 h-7 text-rose-600 dark:text-rose-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-foreground">
                      Enterprise Ready
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Scalable architecture with Clerk authentication,
                      PostgreSQL database, and Vercel deployment for production
                      workloads.
                    </p>
                  </div>
                </Card>

                {/* Analytics */}
                <Card className="relative group overflow-hidden p-8 hover:shadow-xl transition-all duration-500">
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <BarChart3 className="w-7 h-7 text-teal-600 dark:text-teal-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-foreground">
                      Real-time Analytics
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Monitor bucket usage, track file operations, and get
                      insights into your S3 storage patterns with live
                      dashboards.
                    </p>
                  </div>
                </Card>
              </div>
            </AnimatedGroup>
          </div>
        </section>

        {/* Additional Features */}
        <section id="solutions-section" className="relative py-10">
          <div className="mx-auto max-w-7xl px-6">
            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.08,
                      delayChildren: 0.2,
                    },
                  },
                },
                item: transitionVariants.item,
              }}
            >
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Everything You Need for{" "}
                  <Highlighter action="highlight" color="#10B981">
                    S3 Management
                  </Highlighter>
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  From simple file operations to advanced bucket management, S3
                  Buddy provides all the tools you need in one beautiful
                  interface.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                {/* File Upload */}
                <div className="group text-center">
                  <div className="relative">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Upload className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Drag & Drop Upload
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Intuitive file uploads with real-time progress tracking
                  </p>
                </div>

                {/* File Download */}
                <div className="group text-center">
                  <div className="relative">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Download className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Secure Downloads
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Fast, secure file downloads with presigned URLs
                  </p>
                </div>

                {/* Folder Management */}
                <div className="group text-center">
                  <div className="relative">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <FolderOpen className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Smart Folders
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Organize files with virtual folder structures
                  </p>
                </div>

                {/* File Deletion */}
                <div className="group text-center">
                  <div className="relative">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Trash2 className="w-10 h-10 text-red-600 dark:text-red-400" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Safe Deletion
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Secure file deletion with confirmation dialogs
                  </p>
                </div>

                {/* Access Control */}
                <div className="group text-center">
                  <div className="relative">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Lock className="w-10 h-10 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Access Control
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Role-based permissions with encrypted credentials
                  </p>
                </div>
              </div>
            </AnimatedGroup>
          </div>
        </section>
      </main>
    </>
  );
}

const menuItems = [
  {
    name: "Features",
    onClick: () => {
      const element = document.getElementById("features-section");
      element?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
  },
  {
    name: "Solutions",
    onClick: () => {
      const element = document.getElementById("solutions-section");
      element?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
  },
  {
    name: "About",
    onClick: () => {
      const element = document.getElementById("about-section");
      element?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
  },
];

const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className="fixed z-20 w-full px-2 group"
      >
        <div
          className={cn(
            "mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12",
            isScrolled &&
              "bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5"
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2"
              >
                <Logo />
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="in-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
            </div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <button
                      onClick={item.onClick}
                      className="text-muted-foreground hover:text-accent-foreground block duration-150 bg-transparent border-none cursor-pointer"
                    >
                      <span>{item.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <button
                        onClick={() => {
                          item.onClick();
                          setMenuState(false); // Close mobile menu after click
                        }}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150 bg-transparent border-none cursor-pointer text-left w-full"
                      >
                        <span>{item.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <SignInButton mode="modal">
                  <Button
                    asChild
                    size="sm"
                    className={cn(isScrolled && "lg:hidden")}
                  >
                    <Link href="#">
                      <span>Login</span>
                    </Link>
                  </Button>
                </SignInButton>
                <SignInButton mode="modal">
                  <Button
                    asChild
                    size="sm"
                    className={cn(isScrolled ? "lg:inline-flex" : "hidden")}
                  >
                    <Link href="#">
                      <span>Get Started</span>
                    </Link>
                  </Button>
                </SignInButton>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center justify-center w-8 h-8 rounded-xl overflow-hidden">
        <Image
          src="/images/S3.png"
          alt="S3 Logo"
          width={32}
          height={32}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex flex-col">
        <h1 className="text-lg font-bold text-foreground tracking-tight leading-none">
          <HyperText>S3 Buddy</HyperText>
        </h1>
      </div>
    </div>
  );
};
