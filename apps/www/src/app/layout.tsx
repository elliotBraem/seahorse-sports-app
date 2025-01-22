import NearProvider from "@/components/near-provider";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";

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
            "min-h-[100dvh] w-screen overflow-x-hidden relative ",
            "bg-[radial-gradient(circle_at_center,_#2C0F40,_#01030E,_#000000)]",
          )}
        >
          <div className="h-full w-full">
            <Toaster />
            <NearProvider>{children}</NearProvider>
          </div>
        </div>
      </body>
    </html>
  );
}
