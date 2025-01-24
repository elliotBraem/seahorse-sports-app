"use client";

import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

interface HeaderProps {
  showtitle?: boolean;
  showBackButton?: boolean;
  rightChildren?: React.ReactNode;
}

export function Header({
  showtitle = false,
  showBackButton = false,
  rightChildren,
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const formatTitle = (path: string) => {
    const segments = path.split("/").filter(Boolean);
    return segments
      .map(
        (segment) =>
          segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase(),
      )
      .join(", ");
  };

  return (
    <header className="flex items-center justify-between py-6 px-6 lg:px-72">
      <div className="flex items-center min-w-9">
        {showBackButton && (
          <button
            onClick={() => router.back()}
            className="bg-none rounded-full border-none p-0 h-9 w-9 hover:bg-none"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
        )}
      </div>

      <div className={`flex items-center`}>
        {showtitle ? (
          <h1 className="text-xl font-bold">{formatTitle(pathname)}</h1>
        ) : (
          <Image
            src={"/images/rngfanclub-logo-white.png"}
            alt=""
            width={80}
            height={80}
          />
        )}
      </div>

      <div className="flex items-center min-w-9">{rightChildren}</div>
    </header>
  );
}
