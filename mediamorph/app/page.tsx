"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  LogOutIcon,
  MenuIcon,
  LayoutDashboardIcon,
  Share2Icon,
  UploadIcon,
  ImageIcon,
} from "lucide-react";
import { AuroraBackground } from "@/components/ui/aurora-background";

const sidebarItems = [
  { href: "/home", icon: LayoutDashboardIcon, label: "Home Page" },
  { href: "/social-share", icon: Share2Icon, label: "Social Share" },
  { href: "/video-upload", icon: UploadIcon, label: "Video Upload" },
];

const SignOutButton = ({ onSignOut }: { onSignOut: () => void }) => (
  <button onClick={onSignOut} className="btn btn-outline btn-error w-full">
    <LogOutIcon className="mr-2 h-5 w-5" />
    Sign Out
  </button>
);

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { user, isSignedIn } = useUser();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuroraBackground>
      <div className="drawer lg:drawer-open">
        <input
          id="sidebar-drawer"
          type="checkbox"
          className="drawer-toggle"
          checked={sidebarOpen}
          onChange={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="drawer-content flex flex-col">
          {/* Navbar */}
          <header className="w-full bg-base-200 shadow">
            <div className="navbar flex items-center justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex-none lg:hidden">
                <label
                  htmlFor="sidebar-drawer"
                  className="btn btn-square btn-ghost drawer-button"
                  aria-label="Toggle Sidebar"
                >
                  <MenuIcon />
                </label>
              </div>
              <div className="flex-1">
                <Link href="/">
                  <div className="text-2xl font-bold cursor-pointer">
                    MediaMorph
                  </div>
                </Link>
              </div>
              <div className="flex-none flex items-center space-x-4">
                {user && (
                  <>
                    <div className="avatar">
                      <div className="w-8 h-8 rounded-full">
                        <img
                          src={user.imageUrl}
                          alt={
                            user.username || user.emailAddresses[0]?.emailAddress
                          }
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="btn btn-ghost btn-circle"
                      aria-label="Sign Out"
                    >
                      <LogOutIcon className="h-6 w-6" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </header>
          {/* Page Content */}
          <main className="flex-grow">
            <div className="max-w-full px-4 sm:px-6 lg:px-8 my-8">
              <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center max-w-md w-full bg-white p-6 md:p-12 rounded-xl shadow-xl"
                >
                  <h1 className="text-4xl font-extrabold text-gray-900 mb-5">
                    Welcome to <span className="text-pink-500">MediaMorph</span>
                  </h1>
                  <p className="text-gray-600 text-lg font-bold mb-8">
                    Transform your media effortlessly with AI!
                  </p>
                  {!isSignedIn ? (
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                        <p className="text-gray-600 text-lg font-bold">
                          New user?
                        </p>
                        <Link href="/sign-up">
                          <span className="text-lg font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
                            Sign Up
                          </span>
                        </Link>
                      </div>

                      <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                        <p className="text-gray-600 text-lg font-bold">
                          Already a user?
                        </p>
                        <Link href="/sign-in">
                          <span className="text-lg font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
                            Sign In
                          </span>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-700 text-xl">
                      Welcome back,{" "}
                      <span className="font-semibold text-indigo-600">
                        {user?.firstName || "User"}!
                      </span>
                    </p>
                  )}
                </motion.div>
              </div>
            </div>
          </main>
        </div>
        {/* Sidebar */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          className="drawer-side"
        >
          <label htmlFor="sidebar-drawer" className="drawer-overlay"></label>
          <aside className="bg-base-200 w-64 flex flex-col h-full">
            <div className="flex items-center justify-center py-4">
              <ImageIcon className="w-10 h-10 text-primary" />
            </div>
            <ul className="menu p-4 flex-grow">
              {sidebarItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-4 px-4 py-2 rounded-lg ${
                      pathname.startsWith(item.href)
                        ? "bg-primary text-white"
                        : "hover:bg-base-300"
                    }`}
                  >
                    <item.icon className="w-6 h-6" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
            {user && (
              <div className="p-4">
                <SignOutButton onSignOut={handleSignOut} />
              </div>
            )}
          </aside>
        </motion.div>
      </div>
    </AuroraBackground>
  );
}
