import NearProvider from "@/components/near-provider";
import "@/styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NearProvider>{children}</NearProvider>
      </body>
    </html>
  );
}
