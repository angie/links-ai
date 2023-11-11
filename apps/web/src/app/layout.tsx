import "@ui/styles/globals.css";
import type { Metadata } from "next";
import { IBM_Plex_Mono as IBMPlexMono } from "next/font/google";
import { AppShell } from "../components/app-shell";
import { NextAuthProvider } from "../providers/auth";
import { ThemeProvider } from "../providers/theme";

const ibmPlexMono = IBMPlexMono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "savelink.ai | dashboard",
  description: "The smart way to save, organize, and share links with anyone.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={ibmPlexMono.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <NextAuthProvider>
            <AppShell>{children}</AppShell>
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
