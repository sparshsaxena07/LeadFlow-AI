import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "LeadFlow AI | Intelligent CSV Importer",
  description: "Next-gen intelligent CRM lead upload, validation, and schema mapping tool.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body
        className={`${inter.variable} font-sans min-h-screen flex flex-col bg-slate-50/50 text-slate-900 antialiased`}
      >
        <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center font-bold text-white shadow-sm">
                L
              </div>
              <span className="font-semibold text-lg tracking-tight text-slate-900">
                LeadFlow AI
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-650 font-medium">
                CSV Importer v1.0.0
              </span>
            </div>
          </div>
        </header>

        <main className="flex-grow flex flex-col">
          {children}
        </main>

        <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-550">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            &copy; {new Date().getFullYear()} LeadFlow AI. All rights reserved.
          </div>
        </footer>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#ffffff",
              color: "#0f172a",
              border: "1px solid #e2e8f0",
              fontSize: "14px",
              fontWeight: 500,
            },
          }}
        />
      </body>
    </html>
  );
}
