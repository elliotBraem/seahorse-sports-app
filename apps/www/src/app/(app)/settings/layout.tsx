import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Settings | RNG Fan Club",
  description:
    "Manage your account settings, update your email, and control your NEAR wallet connection. Customize your RNG Fan Club experience.",
  openGraph: {
    title: "Account Settings | RNG Fan Club",
    description:
      "Manage your account settings, update your email, and control your NEAR wallet connection. Customize your RNG Fan Club experience.",
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
    title: "Account Settings | RNG Fan Club",
    description:
      "Manage your account settings, update your email, and control your NEAR wallet connection. Customize your RNG Fan Club experience.",
    images: ["/images/rngfanclub-logo-white.png"],
  },
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
