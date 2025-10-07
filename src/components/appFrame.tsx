"use client";

import React from "react";
import Navbar, { NavLinks } from "@/components/navbar";

interface AppFrameProps {
  children: React.ReactNode;
}

export default function AppFrame({ children }: AppFrameProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const toggleSidebar = () => setSidebarOpen((o) => !o);
  const closeSidebar = () => setSidebarOpen(false);
  const openSidebar = () => setSidebarOpen(true);

  return (
    <div className="flex min-h-screen w-full">
      <NavLinks open={sidebarOpen} />
      <div className="flex flex-1 flex-col min-w-0">
        <Navbar
          sidebarOpen={sidebarOpen}
            toggleSidebar={toggleSidebar}
            openSidebar={openSidebar}
            closeSidebar={closeSidebar}
        />
        <main className="flex flex-col items-center align-middle p-4 flex-1 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}