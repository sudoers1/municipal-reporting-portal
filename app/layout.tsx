import type { Metadata } from "next";
import "@/styles/globals.css";
import Navbar from "@/layouts/navbar";
import Footer from "@/layouts/footer";
import { Toaster } from "react-hot-toast";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getNotifications } from "@/lib/notifications/server";

export const metadata: Metadata = {
  title: "Municipal Portal Project",
  description: "Portal for municipal reporting",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const initialNotifications = session?.user
    ? await getNotifications(session.user.id)
    : [];

  return (

    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white dark:bg-black" suppressHydrationWarning={true}>
        <Navbar initialNotifications={initialNotifications} />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}

