import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NotificationProvider } from "@/lib/contexts/NotificationContext";
import { SessionProvider } from "@/lib/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NotificationCenter } from "@/components/NotificationCenter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ServiçoHub",
  description: "Plataforma de serviços e agendamentos",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-50 text-slate-900 selection:bg-slate-300 selection:text-slate-950">
        <NotificationProvider>
          <SessionProvider>
            <ErrorBoundary>
              <Navbar />
              <div className="min-h-[calc(100vh-120px)]">{children}</div>
              <Footer />
              <NotificationCenter />
            </ErrorBoundary>
          </SessionProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
