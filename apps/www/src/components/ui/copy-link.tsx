import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./button";
import { Copy } from "lucide-react";
import toast from "react-hot-toast";

interface ReferLinkProps {
  title: string;
  description: string;
  link: string;
}

export function CopyLink({ title, description, link }: ReferLinkProps) {
  const onCopy = () => {
    navigator.clipboard.writeText(link);
    toast.success("Link copied!");
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center mt-4 justify-between">
        <code className="relative rounded bg-[#ffffff1a] px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold  overflow-hidden whitespace-nowrap text-ellipsis">
          {link}
        </code>
        <Button
          variant="outline"
          size="icon"
          onClick={onCopy}
          className="flex-shrink-0 ml-2"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
