import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/layout/navbar";
import StoreProvider from "@/providers/StoreProvider";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MediStore - Your Trusted Online Pharmacy",
  description: "Purchase high-quality OTC medicines with home delivery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased`}
      >
        <StoreProvider>
          <Navbar />
          {children}
          <Toaster richColors />
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
