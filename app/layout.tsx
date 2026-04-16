import type { Metadata } from "next";
import "@/styles/globals.css";
import Navbar from "@/layouts/navbar";
import Footer from "@/layouts/footer";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Municipal Portal Project",
  description: "Portal for municipal reporting",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white dark:bg-black">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />

        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
