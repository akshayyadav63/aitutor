import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { KnowledgeBaseProvider } from "./context/KnowledgeBaseContext";
import { ThemeProvider } from "./context/ThemeContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Educational Platform",
  description: "A platform for students and faculty to share and learn",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <KnowledgeBaseProvider>
            {children}
          </KnowledgeBaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
