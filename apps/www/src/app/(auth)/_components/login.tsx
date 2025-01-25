"use client";

import { Button } from "@/components/ui/button";
import { loginWithGoogle } from "@/lib/auth";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";

export function Login() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-3 w-full max-w-sm">
      {/* <Button
        onClick={loginWithGoogle}
        className="rounded-full"
        size="lg"
        variant="secondary"
      >
        <div className="flex items-center w-full">
          <div className="w-12 flex justify-center">
            <FontAwesomeIcon icon={faGoogle} className="h-5 w-5" />
          </div>
          <span className="flex-1 text-left">Continue with Google</span>
        </div>
      </Button> */}

      {/* <Button
        onClick={() => {}}
        className="rounded-full"
        size="lg"
        variant="secondary"
        disabled
      >
        <div className="flex items-center w-full">
          <div className="w-12 flex justify-center">
            <FontAwesomeIcon icon={faApple} className="h-5 w-5" />
          </div>
          <span className="flex-1 text-left">Continue with Apple</span>
        </div>
      </Button>

      <Button
        onClick={() => {}}
        className="rounded-full"
        size="lg"
        variant="secondary"
        disabled
      >
        <div className="flex items-center w-full">
          <div className="w-12 flex justify-center">
            <FontAwesomeIcon icon={faXTwitter} className="h-5 w-5" />
          </div>
          <span className="flex-1 text-left">Continue with X</span>
        </div>
      </Button> */}

      {/* <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background p-2 rounded-full text-muted-foreground">
            or
          </span>
        </div>
      </div> */}

      <Button
        onClick={() => router.push("/login?type=email")}
        className="rounded-full"
        size="lg"
      >
        Continue with Email
      </Button>

      <Button
        onClick={() => router.push("/login?type=phone")}
        className="rounded-full"
        size="lg"
      >
        Continue with Phone Number
      </Button>
    </div>
  );
}
