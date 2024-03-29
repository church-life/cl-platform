import "@/styles/globals.css";

import { esES } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";

import Providers from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Church Life",
  description: "A church management system",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <ClerkProvider localization={esES}>
        <body className={`font-sans ${inter.variable}`}>
          <Providers>
            {children}
            <Toaster />
          </Providers>
        </body>
      </ClerkProvider>
    </html>
  );
}
