import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import Navbar, { NavLinks } from "@/components/navbar";
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans"
});

export const metadata: Metadata = {
  title: "Deltapage",
  description: "A collection of Deltarune (and Undertale) media and tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${openSans.variable} antialiased`}>
        <div className="flex flex-row w-full">
            <NavLinks />
          <div className="w-full">
            <Navbar />
            <div className="flex flex-col items-center align-middle p-4">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
