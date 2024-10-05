"use client"

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "../lib/utils";
import { ContextProvider } from "@/components/ContentProvider";
import Banner from "@/components/Banner";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "Palladium Circuit Breaker",
  description:
    "Join the Palladium incentivised testnet to earn Joule points and exclusive rewards.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body >
        <ContextProvider>{children}</ContextProvider>
      </body>
    </html>
  );
}
