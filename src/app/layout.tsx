import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import MobileHeader from "@/components/header";
import MobileNavigation from "@/components/navigations/mobile-nav";
import DesktopNavigation from "@/components/navigations/desktop-nav";
import Footer from "@/components/footer";
import { getSession } from "@/lib/session";

const dmSerif = DM_Serif_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400"
})

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", '700', "800"]
})

export const metadata: Metadata = {
  title: "Toko Monita",
  description: "Platform pembelian kain seragam sekolah",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession()
  return (
    <html
      lang="en"
      className={`${dmSerif.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <MobileHeader />
        <DesktopNavigation session={session} />
        {children}
        <MobileNavigation session={session} />
        <Footer />
      </body>
    </html>
  );
}
