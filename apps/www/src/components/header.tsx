"use client";

import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
      .join(" • ");
  };

  return (
    <header className="safe-area-inset sticky top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center min-w-9">
          {showBackButton && (
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 transition-all duration-200"
            >
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="h-5 w-5 text-white/90"
              />
            </button>
          )}
        </div>

        <div className="flex items-center">
          {showtitle ? (
            <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
              {formatTitle(pathname)}
            </h1>
          ) : (
            <div className="relative h-10 w-10 sm:h-12 sm:w-12">
              <Image
                src="/images/rngfanclub-logo-white.png"
                alt="RNG Fan Club"
                fill
                className="object-contain"
                sizes="(max-width: 640px) 40px, 48px"
                priority
              />
            </div>
          )}
        </div>

        <div className="flex items-center min-w-9">
          {rightChildren && (
            <div className="flex items-center space-x-2">{rightChildren}</div>
          )}
        </div>
      </div>
    </header>
  );
}
