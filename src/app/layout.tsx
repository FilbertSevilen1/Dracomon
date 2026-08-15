import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "../components/Navbar";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Dracoman - Single Player 2D Platform RPG",
  description: "Explore levels, defeat patrolling enemies, collect loot, gain EXP, and upgrade your companion Draco. Play directly in your browser.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className={`${plusJakarta.className} min-h-full flex flex-col bg-stone-950 text-stone-100 selection:bg-amber-500 selection:text-stone-950`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
