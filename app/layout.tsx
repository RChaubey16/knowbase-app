import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CreateWorkspaceModalProvider } from "@/components/modals/create-workspace-modal";
import { Toaster } from "@/components/ui/sonner";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KnowBase - Your Modern Knowledge Base",
  description: "Organize, search, and manage your documents with ease.",
  openGraph: {
    title: "KnowBase - Your Modern Knowledge Base",
    description: "Organize, search, and manage your documents with ease.",
    images: [
      {
        url: "/og-image.png",
        width: 1320,
        height: 880,
        alt: "KnowBase",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KnowBase - Your Modern Knowledge Base",
    description: "Organize, search, and manage your documents with ease.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={montserrat.variable}>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CreateWorkspaceModalProvider>
            {children}
            <Toaster />
          </CreateWorkspaceModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
