"use client";

import Image from "next/image";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import navLinks from "./navLinks.json";
import React from "react";

interface NavbarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
}

export default function Navbar(props: NavbarProps) {
  return <TopBar {...props} />;
}

function TopBar({
  toggleSidebar,
  openSidebar,
  closeSidebar,
}: NavbarProps) {
  const [mobileDrawer, setMobileDrawer] = React.useState(false);

  return (
    <>
      <nav className="bg-[#0b0b3b] p-4 text-white lg:sticky lg:top-0 z-30">
        <div className="container mx-auto flex items-center gap-2">
          <button
            className="p-2 transition cursor-pointer lg:hidden"
            onClick={() => {
              openSidebar();
              setMobileDrawer(true);
            }}
            aria-label="Open navigation menu"
            aria-expanded={mobileDrawer}
            aria-controls="mobile-drawer"
          >
            <Menu />
          </button>

          <button
            className="p-2 cursor-pointer hidden lg:inline-flex"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Menu />
          </button>

          <Image
            src={"/delta.png"}
            width={100}
            height={100}
            alt="Deltapage logo"
            onClick={() => (window.location.href = "/")}
            style={{ cursor: "pointer" }}
            priority
          />
        </div>
      </nav>

      <div
        id="mobile-drawer"
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-[#0b0b3b] shadow transform transition-transform duration-200 ease-out lg:hidden flex flex-col
        ${mobileDrawer ? "translate-x-0" : "-translate-x-full"}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <span className="font-semibold">Menu</span>
          <button
            aria-label="Close navigation menu"
            onClick={() => {
              setMobileDrawer(false);
              closeSidebar();
            }}
            className="p-2"
          >
            <X />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => {
                setMobileDrawer(false);
                closeSidebar();
              }}
              className="block px-4 py-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {link.title}
            </Link>
          ))}
        </div>
      </div>

      {mobileDrawer && (
        <button
          aria-label="Close menu overlay"
          onClick={() => {
            setMobileDrawer(false);
            closeSidebar();
          }}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}
    </>
  );
}

interface NavLinksProps {
  open: boolean;
}

export function NavLinks({ open }: NavLinksProps) {
  return (
    <div
      className={`hidden lg:flex flex-col h-screen bg-white dark:bg-[#0b0b3b] border-r border-gray-200 dark:border-gray-800 sticky top-0 transition-all duration-200 overflow-hidden
      ${open ? "w-64" : "w-0 border-r-0"}`}
      aria-hidden={!open}
    >
      <div
        className={`p-4 h-full overflow-y-auto transition-opacity duration-150 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-[#6a7bc4] transition"
          >
            {link.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
