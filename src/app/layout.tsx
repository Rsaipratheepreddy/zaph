import type { Metadata } from "next";
import "../styles/globals.css";
import PageTransition from "@/components/PageTransition";
import GlobalFonts, { fontClasses } from "@/components/GlobalFonts";

export const metadata: Metadata = {
  title: 'DimensionLess',
  description: 'Art, Tech, Music, Tattoo - Creative Agency',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className={fontClasses.inter}>
        <GlobalFonts />
        <PageTransition />
        {children}
      </body>
    </html>
  );
}
