import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Lines from "@/components/Lines";
import Header from "@/components/Header";
import ToasterContext from "@/context/ToastContext";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { AppContextProvider } from "@/context/AppContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "TrustSphere",
  icons: { icon: "/icon.svg", shortcut: "/icon.svg" },
  description:
    "Collect text and video testimonials with a branded link, manage customer stories, and display them on your website with TrustSphere.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`dark:bg-black ${inter.variable}`}>
        <ThemeProvider
          // enableSystem={false}
          attribute="class"
          // defaultTheme="light"
        >
          <Lines />
          <ToasterContext />
          <AppContextProvider>
            <Header />
            {children}
          </AppContextProvider>
          <Footer />
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
