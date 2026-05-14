import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    default: "Yelk Finance — Digitaal boekhoudplatform",
    template: "%s | Yelk Finance",
  },
  description:
    "Yelk Finance is een modern digitaal boekhoudplatform voor ondernemers. Beheer uw administratie, facturen en belastingaangiften eenvoudig online.",
  keywords: [
    "boekhoudplatform",
    "online boekhouding",
    "facturatie",
    "administratie",
    "btw aangifte",
    "yelk finance",
  ],
  authors: [{ name: "Yelk Finance" }],
  creator: "Yelk Finance",
  metadataBase: new URL("https://yelkfinance.nl"),
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "https://yelkfinance.nl",
    title: "Yelk Finance — Digitaal boekhoudplatform",
    description:
      "Modern digitaal boekhoudplatform voor ondernemers. Eenvoudig, veilig en schaalbaar.",
    siteName: "Yelk Finance",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yelk Finance",
    description: "Modern digitaal boekhoudplatform voor ondernemers.",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Yelk Finance",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#5d87ff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "500",
            },
            success: {
              iconTheme: { primary: "#5d87ff", secondary: "#fff" },
            },
          }}
        />
      </body>
    </html>
  );
}
