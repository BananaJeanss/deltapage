import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import Navbar, { NavLinks } from "@/components/navbar";
import FooterComp from "@/components/footer";
import "./globals.css";

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  weight: ["400", "600", "700"],
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
      <body className={`${lexend.variable} antialiased`}>
        <div className="flex flex-row w-full min-h-screen">
          <NavLinks />
          <div className="flex flex-col flex-1">
            <Navbar />
            <main className="flex flex-col items-center align-middle p-4 flex-1">
              {children}
            </main>
            <FooterComp />
          </div>
        </div>
      </body>
    </html>
  );
}
