import { QueryProvider } from "@/components/query-provider";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/toaster";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: {
    default: "RNG Fan Club | Sports Prediction Platform",
    template: "%s | RNG Fan Club",
  },
  metadataBase: new URL("https://app.rngfan.club"),
  description:
    "Join RNG Fan Club to predict sports outcomes, compete with others, and win rewards on the NEAR blockchain.",
  keywords: [
    "sports prediction",
    "blockchain",
    "NEAR protocol",
    "RNG Fan Club",
    "crypto gaming",
  ],
  authors: [{ name: "RNG Fan Club" }],
  creator: "RNG Fan Club",
  publisher: "RNG Fan Club",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://app.rngfan.club",
    siteName: "RNG Fan Club",
    title: "RNG Fan Club | Sports Prediction Platform",
    description:
      "Join RNG Fan Club to predict sports outcomes, compete with others, and win rewards on the NEAR blockchain.",
    images: [
      {
        url: "/images/rngfanclub-logo-white.png",
        width: 1200,
        height: 630,
        alt: "RNG Fan Club Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RNG Fan Club | Sports Prediction Platform",
    description:
      "Join RNG Fan Club to predict sports outcomes, compete with others, and win rewards on the NEAR blockchain.",
    images: ["/images/rngfanclub-logo-white.png"],
  },
  icons: {
    icon: "/images/favicon.jpg",
    shortcut: "/images/favicon.jpg",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div
          className={cn(
            "min-h-[100dvh] px-2 w-screen overflow-x-hidden relative ",
            "bg-[radial-gradient(circle_at_center,_#2C0F40,_#01030E,_#000000)]",
          )}
        >
          <div className="h-full w-full">
            <Toaster />
            <QueryProvider>{children}</QueryProvider>
          </div>
        </div>
      </body>
    </html>
  );
}
