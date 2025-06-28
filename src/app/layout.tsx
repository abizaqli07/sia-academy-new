import "~/styles/globals.css";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { type Metadata } from "next";
import { Geist } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { extractRouterConfig } from "uploadthing/server";

import { ActiveThemeProvider } from "~/components/theme/active-theme";
import Providers from "~/components/theme/providers";
import { Toaster } from "~/components/ui/sonner";
import { TRPCReactProvider } from "~/trpc/react";
import { ourFileRouter } from "./api/uploadthing/core";

export const metadata: Metadata = {
  title: "SIA Academy",
  description:
    "Built for the final assignment of undergraduate degree in Information Technology and Computer Education",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <TRPCReactProvider>
          <NextTopLoader />
          <Providers>
            <ActiveThemeProvider>
              <NextSSRPlugin
                routerConfig={extractRouterConfig(ourFileRouter)}
              />
              <Toaster />
              {children}
            </ActiveThemeProvider>
          </Providers>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
