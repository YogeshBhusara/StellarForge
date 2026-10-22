import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "StellarForge — NASA Sci-Fi Writing Assistant",
  description:
    "Write scientifically grounded science fiction using NASA-inspired terminology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body className="starfield h-full overflow-hidden font-sans text-[16px] leading-relaxed text-white">
        <Navbar />
        <main className="relative z-10 mx-auto h-[calc(100vh-3.75rem)] max-w-[1440px] overflow-hidden px-3 py-3 sm:px-5">
          {children}
        </main>
      </body>
    </html>
  );
}
