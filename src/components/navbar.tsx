"use client";

import Image from "next/image";
import { Menu } from "lucide-react";
import Link from "next/link";
import navLinks from "./navLinks.json";

function openMenu() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar) {
    if (sidebar.style.display === "flex") {
      sidebar.style.display = "none";
    } else {
      sidebar.style.display = "flex";
    }
  }
}

export default function Navbar() {
  return <TopBar />;
}

export function TopBar() {
  return (
    <nav className="bg-gray-950 p-4 text-white">
      <div className="container mx-auto flex items-center gap-2">
        <button
          className="p-2 transition cursor-pointer"
          id="menu-button"
          onClick={openMenu}
        >
          <Menu />
        </button>
        <Image
          src={"/delta.png"}
          width={"100"}
          height={"100"}
          alt="Deltapage logo"
          onClick={() => (window.location.href = "/")}
          style={{ cursor: "pointer" }}
        />
      </div>
    </nav>
  );
}

export function NavLinks() {
  return (
    <div
      className="h-screen flex-col hidden w-1/4 border-r border-gray-200 transition"
      id="sidebar"
    >
      <div className="p-4 h-full">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block px-4 py-2 transition border-b-1 hover:bg-gray-200 hover:text-gray-900"
          >
            {link.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
