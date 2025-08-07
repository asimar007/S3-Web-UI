"use client";

import { SignInButton } from "@clerk/nextjs";
import {
  Cloud,
  Shield,
  Zap,
  Upload,
  Download,
  Lock,
  Trash2,
} from "lucide-react";

import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="relative z-20 bg-transparent">
        <div className="container mx-auto px-6 py-4">
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
                  S3 <span className="text-emerald-600">Buddy</span>
                </h1>
                <p className="text-xs text-slate-500 font-medium tracking-wide">
                  Storage Management Console
                </p>
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <SignInButton mode="modal">
                <button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                  Get Started
                </button>
              </SignInButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-amber-900 mb-6 leading-tight">
            S3 File
            <span className="text-orange-700"> Explorer</span>
          </h1>
          <p className="text-xl text-amber-800/80 mb-8 leading-relaxed">
            Manage your AWS S3 buckets with enterprise-grade security and a
            beautiful interface. Your credentials are encrypted and protected
            with AES-256 encryption.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <SignInButton mode="modal">
              <button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl backdrop-blur-sm">
                Start Managing Files
              </button>
            </SignInButton>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-amber-700/70 mb-16">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full">
              <Lock className="h-4 w-4 text-amber-600" />
              <span className="font-medium">AES-256 Encrypted</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full">
              <Shield className="h-4 w-4 text-amber-600" />
              <span className="font-medium">Enterprise Security</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full">
              <Cloud className="h-4 w-4 text-amber-600" />
              <span className="font-medium">AWS Native</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              Encrypted Storage
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Your AWS credentials are encrypted with AES-256 before being
              stored. Even if our database is compromised, your secrets remain
              safe.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
              <Cloud className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              S3 Integration
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Direct integration with your S3 buckets. Browse, upload, download,
              delete, and manage files with a beautiful web interface.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              Fast & Secure
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Lightning-fast file operations with security-first architecture.
              Built with modern web technologies for optimal performance.
            </p>
          </div>
        </div>

        {/* Additional Features */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            Everything you need to manage S3
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">File Upload</h4>
              <p className="text-sm text-gray-600">
                Drag & drop file uploads with progress tracking
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                File Download
              </h4>
              <p className="text-sm text-gray-600">
                Secure file downloads with signed URLs
              </p>
            </div>

            <div className="text-center">
              <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="h-8 w-8 text-red-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                File Deletion
              </h4>
              <p className="text-sm text-gray-600">
                Safe file deletion with confirmation dialogs
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Cloud className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Folder Navigation
              </h4>
              <p className="text-sm text-gray-600">
                Intuitive folder structure browsing
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Secure Access
              </h4>
              <p className="text-sm text-gray-600">
                Role-based access with encrypted credentials
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
