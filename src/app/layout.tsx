import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProviders from "@/providers/AuthProviders";
import StoreProvider from "@/providers/StoreProvider";
import QueryClientProviderLocal from "@/provider/QueryClientProviderLocal";
import { AlertProvider } from "@/components/AlertPopUp/AlertPopup";
import { ModalProvider } from "@/components/shared/modal";
import GlobalModal from "@/components/shared/modal/GlobalModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Flat Mate — Shared flat expenses & meal planning",
    template: "%s | Flat Mate",
  },
  description:
    "Flat Mate helps flatmates track shared expenses, meals and balances in one place — create plans, add members, log transactions and chat in real time.",
  applicationName: "Flat Mate",
  keywords: ["flat mate", "shared expenses", "meal planning", "roommates", "expense tracker"],
  openGraph: {
    title: "Flat Mate",
    description: "Track shared flat expenses, meals and balances together.",
    siteName: "Flat Mate",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#00d1ff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <StoreProvider>
          <AuthProviders>
            <QueryClientProviderLocal>
              <AlertProvider>
                <ModalProvider>
                  {children}
                  <GlobalModal />
                </ModalProvider>
              </AlertProvider>
            </QueryClientProviderLocal>
          </AuthProviders>
        </StoreProvider>
      </body>
    </html>
  );
}
