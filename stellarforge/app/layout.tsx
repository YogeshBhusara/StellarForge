import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
    <html lang="en" className="dark">
      <body className="starfield min-h-screen font-sans text-white">
        <Navbar />
        <div className="relative z-10 mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
