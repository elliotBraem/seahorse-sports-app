import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 text-center">
      <h1 className="text-4xl font-bold">Renegade Fan Club</h1>
      <p className="text-lg text-gray-600">Your gateway to sports engagement</p>
      <Link href="/login" passHref>
        <Button>Get Started</Button>
      </Link>
    </div>
  );
}
