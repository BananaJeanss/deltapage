import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import FooterComp from "@/components/footer";
import AppFrame from "@/components/appFrame";
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
        <AppFrame>{children}</AppFrame>
        <FooterComp />
      </body>
    </html>
  );
}
