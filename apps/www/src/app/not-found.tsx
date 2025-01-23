import { NotFound } from "@/components/not-found";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 | RNG Fan Club",
  description: "Page not Found",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "404 | RNG Fan Club",
    description: "The page you're looking for doesn't exist",
    images: [
      {
        url: "/images/404.gif",
        width: 1200,
        height: 630,
        alt: "404 Error",
      },
    ],
  },
  twitter: {
    title: "404 | RNG Fan Club",
    description: "The page you're looking for doesn't exist",
    images: ["/images/404.gif"],
  },
};

export default function NotFoundPage() {
  return (
    <main>
      <NotFound />
    </main>
  );
}
