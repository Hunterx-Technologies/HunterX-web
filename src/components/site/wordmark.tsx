import Link from "next/link";
import { cn } from "@/lib/utils";

/** Text wordmark: "Hunter" in the foreground color, "X" in orange. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="HunterX home"
      className={cn(
        "rounded-md text-xl font-extrabold tracking-tight text-foreground",
        className,
      )}
    >
      Hunter<span className="text-primary-text">X</span>
    </Link>
  );
}
