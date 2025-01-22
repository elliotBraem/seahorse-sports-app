import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function NotFound() {
  return (
    <div
      className={cn("min-h-[100dvh] w-full overflow-x-hidden", "bg-background")}
    >
      <div className={"flex min-h-[100vh] items-center justify-center p-6"}>
        <Card className="max-w-md w-full">
          <CardContent className="space-y-8 pt-6">
            <div className="text-center space-y-4">
              <h1 className="text-xl font-bold">404 Page Not Found</h1>
              <img
                src="/images/404.gif"
                alt="404 Page Not Found"
                width={500}
                height={500}
              />
              <p className="text-gray-500 text-sm py-3">
                The page you’re looking for doesn’t exist.
              </p>
            </div>
            <div>
              <Link href="/">
                <Button className="w-full" size="lg">
                  Go Back Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
