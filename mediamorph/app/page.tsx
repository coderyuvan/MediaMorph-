"use client";
import { motion } from "framer-motion";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
import { Vortex } from "@/components/ui/vortex";

const sidebarItems = [
  { href: "/home", icon: LayoutDashboardIcon, label: "Home Page" },
  { href: "/social-share", icon: Share2Icon, label: "Social Share" },
  { href: "/video-upload", icon: UploadIcon, label: "Video Upload" },
];

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { user, isSignedIn } = useUser();

  const handleLogoClick = () => {
    router.push("/");
  };

  const handleSignOut = async () => {
    await signOut();
  };
  
  
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 80 }}
        whileInView={{ opacity: 0.2, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      ></motion.div>

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
          <header className="w-full bg-base-200">
            <div className="navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex-none lg:hidden">
                <label
                  htmlFor="sidebar-drawer"
                  className="btn btn-square btn-ghost drawer-button"
                >
                  <MenuIcon />
                </label>
              </div>
              <div className="flex-1">
                <Link href="/" onClick={handleLogoClick}>
                  <div className="  normal-case text-2xl font-bold tracking-tight cursor-pointer pt-12">
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
                          alt={user.username || user.emailAddresses[0].emailAddress}
                        />
                      </div>
                    </div>
                    <span
                      className="hidden sm:block text-sm truncate max-w-xs lg:max-w-md tooltip tooltip-bottom"
                      data-tip={user.emailAddresses[0].emailAddress}
                    >
                      {user.username || user.emailAddresses[0].emailAddress}
                    </span>
                    <button
                      onClick={handleSignOut}
                      className="btn btn-ghost btn-circle"
                    >
                      <LogOutIcon className="h-6 w-6" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </header>
          {/* Page content */}
          <main className="flex-grow">
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 my-8">
              {pathname === "/" ? (
                <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gradient-to-bl from-cupcake-pink via-white to-indigo-300 rounded-lg shadow-lg p-8">
                  <div className="text-center max-w-md mx-auto bg-white p-12 rounded-xl shadow-xl animate-fade-in-scale">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-5">
                      Welcome to <span className="text-pink-500">MediaMorph</span>
                    </h1>
                    <p className="text-gray-600 text-lg font-bold mb-8">
                      Transform your media effortlessly with AI!
                    </p>
                    {!isSignedIn ? (
                      <div className="flex flex-col gap-6">
                        <div className="text-center flex gap-4">
                          <p className="text-gray-600 mb-2 text-lg ml-24 font-bold">New user? </p>
                          <Link href="/sign-up">
                            <span className="text-lg font-semibold text-blue-600 hover:text-blue-800 cursor-pointer transform transition hover:scale-105">
                              Sign Up
                            </span>
                          </Link>
                        </div>

                        <div className="text-center flex gap-4">
                          <p className="text-gray-600 mb-2 ml-20 text-lg font-bold">Already a user?</p>
                          <Link href="/sign-in">
                            <span className="text-lg font-semibold text-blue-600 hover:text-blue-800 cursor-pointer transform transition hover:scale-105">
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
                  </div>
                </div>
              ) : (
                children
              )}
            </div>
          </main>
        </div>
        <div className="drawer-side relative z-20">
          <label htmlFor="sidebar-drawer" className="drawer-overlay"></label>
          <aside className="bg-base-200 w-64 h-full flex flex-col">
            <div className="flex items-center justify-center py-4">
              <ImageIcon className="w-10 h-10 text-primary" />
            </div>
            <ul className="menu p-4 w-full text-base-content flex-grow">
              {sidebarItems.map((item) => (
                <li key={item.href} className="mb-2">
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-4 px-4 py-2 rounded-lg ${
                      pathname === item.href
                        ? "bg-primary text-white"
                        : "hover:bg-base-300"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="w-6 h-6" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
            {user && (
              <div className="p-4">
                <button
                  onClick={handleSignOut}
                  className="btn btn-outline btn-error w-full"
                >
                  <LogOutIcon className="mr-2 h-5 w-5" />
                  Sign Out
                </button>
              </div>
            )}
          </aside>
        </div>
      </div>
    </AuroraBackground>
  );
}
