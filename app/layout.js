import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AirAfford - Smart Flight Search with AI",
  description: "Find the best flight deals with our AI-powered search engine. Compare prices, get smart recommendations, and save on your next trip.",
  keywords: "flights, travel, deals, cheap flights, flight search, AI recommendations",
  icons: {
    icon: "/airplane.svg",
    apple: "/airplane.svg",
  },
  openGraph: {
    title: "AirAfford - Smart Flight Search with AI",
    description: "Find the best flight deals with our AI-powered search engine",
    type: "website",
  },
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
